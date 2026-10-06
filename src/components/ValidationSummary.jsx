import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  FileDown, 
  CheckCheck, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  Loader2,
  FileCheck
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function ValidationSummary({
  requirements,
  matches,
  uploadedFiles,
  statuses,
  lang,
  onGeneratePackage,
  isGenerating,
  includeIndexPage,
  setIncludeIndexPage,
  hasSealConfigured
}) {
  const t = translations[lang] || translations.en;

  const totalReqs = requirements.length;
  const mandatoryReqs = requirements.filter(r => r.mandatory).length;
  
  // Calculate status counts
  let okCount = 0;
  let blockingIssues = [];

  requirements.forEach(req => {
    const statusObj = statuses[req.id] || { status: 'Missing', blocks: req.mandatory };
    if (statusObj.status === 'OK' || statusObj.status === 'Not provided') {
      okCount++;
    }
    if (statusObj.blocks) {
      let reasonText = '';
      if (statusObj.status === 'Missing') {
        reasonText = `${req.order}. ${lang === 'bn' ? req.title_bn : req.title_en} (${req.id}): ${lang === 'bn' ? 'বাধ্যতামূলক নথিটি অনুপস্থিত' : 'Mandatory document file is missing.'}`;
      } else if (statusObj.status === 'Expiry date needed') {
        reasonText = `${req.order}. ${lang === 'bn' ? req.title_bn : req.title_en} (${req.id}): ${lang === 'bn' ? 'মেয়াদোত্তীর্ণের তারিখ প্রদান করুন' : 'Expiry date is required for this file.'}`;
      } else if (statusObj.status === 'Expired') {
        reasonText = `${req.order}. ${lang === 'bn' ? req.title_bn : req.title_en} (${req.id}): ${lang === 'bn' ? 'নথির মেয়াদ দরপত্র জমার শেষ তারিখের পূর্বে উত্তীর্ণ হয়েছে' : 'Document has expired before submission deadline.'}`;
      }
      blockingIssues.push({ req, reason: reasonText });
    }
  });

  const isPackageReady = blockingIssues.length === 0 && totalReqs > 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.summaryTitle}
          </h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          isPackageReady
            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
        }`}>
          {isPackageReady ? t.readyToGenerate : `${blockingIssues.length} ${t.blockingIssues}`}
        </span>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{t.totalRequirements}</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">{totalReqs}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">{t.mandatoryDocs}</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">{mandatoryReqs}</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block">{t.readyCount}</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-300 mt-1 block">{okCount}</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-center">
          <span className="text-[11px] font-medium text-rose-700 dark:text-rose-400 block">{t.blockingIssues}</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-300 mt-1 block">{blockingIssues.length}</span>
        </div>

      </div>

      {/* Blocking Issues Breakdown List */}
      {!isPackageReady && blockingIssues.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80">
          <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-xs sm:text-sm mb-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{t.generationBlocked}:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-rose-700 dark:text-rose-300">
            {blockingIssues.map((issue, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{issue.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Package Options */}
      <div className="pt-2 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center space-x-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={includeIndexPage}
            onChange={(e) => setIncludeIndexPage(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
          />
          <span className="font-medium">{t.indexPageIncluded} (Bonus)</span>
        </label>

        {hasSealConfigured && (
          <span className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.sealApplied}</span>
          </span>
        )}
      </div>

      {/* Big Action CTA Button */}
      <button
        onClick={onGeneratePackage}
        disabled={!isPackageReady || isGenerating}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition shadow-lg ${
          isPackageReady
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-600/25 cursor-pointer scale-[1.01]'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t.generating}</span>
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            <span>{t.generatePackage}</span>
          </>
        )}
      </button>

    </div>
  );
}
