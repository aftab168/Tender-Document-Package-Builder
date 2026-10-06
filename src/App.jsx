import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { PDFDocument } from 'pdf-lib';
import Header from './components/Header';
import TenderOverview from './components/TenderOverview';
import UploadPool from './components/UploadPool';
import RequirementsTable from './components/RequirementsTable';
import ValidationSummary from './components/ValidationSummary';
import PackageModal from './components/PackageModal';
import PreviewModal from './components/PreviewModal';
import SealModal from './components/SealModal';
import AiModal from './components/AiModal';

import { sampleRequirements, sampleFilesList } from './data/sampleData';
import { translations } from './i18n/translations';
import { calculateFileHash, analyzeDuplicates } from './utils/duplicateDetector';
import { autoMatchFiles, extractSuggestedExpiry } from './utils/autoMatcher';
import { generateTenderPackage } from './utils/pdfGenerator';
import { exportChecklistToExcel, exportChecklistToCSV } from './utils/excelExporter';

export default function App() {
  const [lang, setLang] = useState('en');
  const [tender, setTender] = useState(sampleRequirements.tender);
  const [requirements, setRequirements] = useState(sampleRequirements.requirements);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [matches, setMatches] = useState({});
  const [sealConfig, setSealConfig] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [includeIndexPage, setIncludeIndexPage] = useState(true);
  
  // Modals
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isSealModalOpen, setIsSealModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const t = translations[lang] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Compute status for all requirements
  const statuses = useMemo(() => {
    const result = {};
    if (!requirements || requirements.length === 0) return result;
    const deadline = tender?.submission_deadline || '';

    requirements.forEach((req) => {
      const fileId = matches[req.id];
      const file = uploadedFiles.find((f) => f.id === fileId);

      if (!file) {
        if (req.mandatory) {
          result[req.id] = { status: 'Missing', blocks: true };
        } else {
          result[req.id] = { status: 'Not provided', blocks: false };
        }
      } else {
        if (req.has_expiry) {
          if (!file.expiryDate) {
            result[req.id] = { status: 'Expiry date needed', blocks: true };
          } else if (file.expiryDate < deadline) {
            // Expiry date before submission deadline is Expired
            result[req.id] = { status: 'Expired', blocks: true };
          } else {
            result[req.id] = { status: 'OK', blocks: false };
          }
        } else {
          result[req.id] = { status: 'OK', blocks: false };
        }
      }
    });

    return result;
  }, [requirements, matches, uploadedFiles, tender]);

  // Handle PDF file upload
  const handleUploadPDFs = async (fileList) => {
    const newFiles = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        showToast(t.invalidFileError + ` (${file.name})`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Parse PDF to get page count and ensure it is not corrupt
        let pageCount = 1;
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } catch (pdfErr) {
          console.warn("PDF parse error:", pdfErr);
          showToast(t.corruptFileError + ` (${file.name})`);
          continue;
        }

        const hash = await calculateFileHash(arrayBuffer);
        const url = URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }));
        const suggestedExpiry = extractSuggestedExpiry(file.name);

        newFiles.push({
          id: 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
          name: file.name,
          size: file.size,
          pageCount,
          arrayBuffer,
          hash,
          url,
          expiryDate: suggestedExpiry || ''
        });
      } catch (err) {
        console.error("Error reading file:", err);
        showToast(t.corruptFileError + ` (${file.name})`);
      }
    }

    if (newFiles.length > 0) {
      setUploadedFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return analyzeDuplicates(combined);
      });
      showToast(`Uploaded ${newFiles.length} PDF document(s).`);
    }
  };

  // Remove an uploaded file
  const handleRemoveFile = (fileId) => {
    // Also remove from matches
    setMatches((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (updated[k] === fileId) {
          delete updated[k];
        }
      });
      return updated;
    });

    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== fileId);
      return analyzeDuplicates(filtered);
    });
  };

  // Change matching of a requirement to a file
  const handleMatchChange = (reqId, fileId) => {
    setMatches((prev) => {
      const updated = { ...prev };
      if (!fileId) {
        delete updated[reqId];
        return updated;
      }

      // Check if file is duplicate copy
      const file = uploadedFiles.find((f) => f.id === fileId);
      if (file && file.isDuplicateCopy) {
        showToast(t.duplicateWarning.replace('{filename}', file.duplicateOf || 'another file'));
        return prev;
      }

      // 1-to-1 constraint: remove from any other requirement
      Object.keys(updated).forEach((k) => {
        if (updated[k] === fileId) {
          delete updated[k];
        }
      });

      updated[reqId] = fileId;
      return updated;
    });
  };

  // Change expiry date for a file
  const handleExpiryChange = (fileId, newDate) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, expiryDate: newDate } : f))
    );
  };

  // Run Auto-matching algorithm
  const handleAutoMatch = () => {
    const autoMatches = autoMatchFiles(requirements, uploadedFiles);
    const count = Object.keys(autoMatches).length;
    
    if (count > 0) {
      setMatches((prev) => ({ ...prev, ...autoMatches }));
      showToast(t.autoMatchSuccess.replace('{count}', count));
    } else {
      showToast(t.autoMatchNone);
    }
  };

  // Load sample data (requirements.json)
  const handleLoadSampleData = () => {
    setTender(sampleRequirements.tender);
    setRequirements(sampleRequirements.requirements);
    showToast("Loaded official sample requirements.json!");
  };

  // Load sample documents from /documents/ folder
  const handleLoadSampleFiles = async () => {
    try {
      const loaded = [];
      for (const item of sampleFilesList) {
        const res = await fetch(item.path);
        if (!res.ok) continue;
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        
        let pageCount = 1;
        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
        } catch (e) {}

        const hash = await calculateFileHash(arrayBuffer);
        const url = URL.createObjectURL(blob);
        const suggestedExpiry = extractSuggestedExpiry(item.name);

        loaded.push({
          id: 'file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
          name: item.name,
          size: blob.size,
          pageCount,
          arrayBuffer,
          hash,
          url,
          expiryDate: suggestedExpiry || ''
        });
      }

      if (loaded.length > 0) {
        setUploadedFiles(analyzeDuplicates(loaded));
        showToast(`Loaded ${loaded.length} sample PDF documents!`);
      }
    } catch (err) {
      console.error("Error loading sample files:", err);
      showToast("Could not load sample files. Please drag and drop PDF files from the documents/ folder.");
    }
  };

  // Upload custom requirements.json file
  const handleLoadRequirementsFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result);
        if (json.tender && json.requirements) {
          setTender(json.tender);
          setRequirements(json.requirements);
          setMatches({});
          showToast("Custom requirements.json loaded successfully!");
        } else {
          showToast("Invalid requirements.json format.");
        }
      } catch (err) {
        showToast("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Reset all state
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all document assignments and files?")) {
      setMatches({});
      setUploadedFiles([]);
      setSealConfig(null);
      setPackageData(null);
      showToast("Workspace reset.");
    }
  };

  // Save Project as JSON
  const handleExportProject = () => {
    const projectState = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      tender,
      requirements,
      matches,
      includeIndexPage,
      filesMeta: uploadedFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        pageCount: f.pageCount,
        hash: f.hash,
        expiryDate: f.expiryDate
      }))
    };

    const blob = new Blob([JSON.stringify(projectState, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tender?.tender_id || 'Tender'}_Project.json`;
    link.click();
    showToast(t.projectSaved);
  };

  // Open Project from JSON
  const handleImportProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const state = JSON.parse(ev.target?.result);
        if (state.tender && state.requirements) {
          setTender(state.tender);
          setRequirements(state.requirements);
          if (state.matches) setMatches(state.matches);
          if (state.includeIndexPage !== undefined) setIncludeIndexPage(state.includeIndexPage);
          showToast(t.projectLoaded);
        } else {
          showToast(t.invalidProjectFile);
        }
      } catch (err) {
        showToast(t.invalidProjectFile);
      }
    };
    reader.readAsText(file);
  };

  // Export Excel / CSV
  const handleExportExcel = () => {
    exportChecklistToExcel(tender, requirements, matches, uploadedFiles, statuses, lang);
    showToast("Excel checklist exported!");
  };

  const handleExportCSV = () => {
    exportChecklistToCSV(tender, requirements, matches, uploadedFiles, statuses, lang);
    showToast("CSV checklist exported!");
  };

  // Generate Tender Package PDF
  const handleGeneratePackage = async () => {
    setIsGenerating(true);
    try {
      // Try to load company logo
      let logoBytes = null;
      try {
        const logoRes = await fetch('./documents/company_logo.png');
        if (logoRes.ok) {
          const blob = await logoRes.blob();
          logoBytes = await blob.arrayBuffer();
        }
      } catch (e) {
        console.warn("Could not load default logo:", e);
      }

      const res = await generateTenderPackage({
        tender,
        requirements,
        matches,
        uploadedFiles,
        logoBytes,
        sealConfig,
        includeIndexPage
      });

      const pdfBlob = new Blob([res.pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      setPackageData({
        ...res,
        pdfUrl
      });

      setIsPackageModalOpen(true);
      
      // Trigger confetti celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      showToast(t.packageGeneratedSuccess);
    } catch (err) {
      console.error("Package generation error:", err);
      alert("Error generating package: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        onLoadSampleData={handleLoadSampleData}
        onLoadSampleFiles={handleLoadSampleFiles}
        onReset={handleReset}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
        onOpenSealModal={() => setIsSealModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        hasTenderData={Boolean(tender)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs sm:text-sm font-medium animate-slide-up flex items-center space-x-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section 1: Tender Overview Card */}
        <TenderOverview
          tender={tender}
          lang={lang}
          onLoadRequirementsFile={handleLoadRequirementsFile}
          onLoadSampleData={handleLoadSampleData}
        />

        {/* Section 2: Validation Progress & Generate CTA */}
        <ValidationSummary
          requirements={requirements}
          matches={matches}
          uploadedFiles={uploadedFiles}
          statuses={statuses}
          lang={lang}
          onGeneratePackage={handleGeneratePackage}
          isGenerating={isGenerating}
          includeIndexPage={includeIndexPage}
          setIncludeIndexPage={setIncludeIndexPage}
          hasSealConfigured={Boolean(sealConfig)}
        />

        {/* Section 3: Requirements Checklist Table */}
        <RequirementsTable
          requirements={requirements}
          matches={matches}
          uploadedFiles={uploadedFiles}
          statuses={statuses}
          lang={lang}
          onMatchChange={handleMatchChange}
          onExpiryChange={handleExpiryChange}
          onPreviewFile={(f) => setPreviewFile(f)}
          submissionDeadline={tender?.submission_deadline}
        />

        {/* Section 4: Uploaded Files Pool */}
        <UploadPool
          uploadedFiles={uploadedFiles}
          requirements={requirements}
          matches={matches}
          lang={lang}
          onUploadPDFs={handleUploadPDFs}
          onRemoveFile={handleRemoveFile}
          onAutoMatch={handleAutoMatch}
          onPreviewFile={(f) => setPreviewFile(f)}
          onLoadSampleFiles={handleLoadSampleFiles}
        />

      </main>

      {/* Modals */}
      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        packageData={packageData}
        tender={tender}
        lang={lang}
      />

      <PreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <SealModal
        isOpen={isSealModalOpen}
        onClose={() => setIsSealModalOpen(false)}
        sealConfig={sealConfig}
        setSealConfig={setSealConfig}
        lang={lang}
      />

      <AiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        lang={lang}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      {/* Bottom Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {t.footerText}
          </p>
          <p className="text-[11px] text-slate-400">
            {t.developedWith}
          </p>
        </div>
      </footer>

    </div>
  );
}
