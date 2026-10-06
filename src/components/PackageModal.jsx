import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  FileText, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function PackageModal({
  isOpen,
  onClose,
  packageData, // { pdfBytes, totalPages, filename, pdfUrl }
  tender,
  lang
}) {
  const t = translations[lang] || translations.en;

  if (!isOpen || !packageData) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = packageData.pdfUrl;
    link.download = packageData.filename || `${tender?.tender_id || 'Tender'}_Package.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{t.packageGeneratedSuccess}</span>
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {packageData.filename} • {packageData.totalPages} {t.pages}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body / PDF Preview */}
        <div className="flex-1 overflow-hidden p-4 bg-slate-100 dark:bg-slate-950 flex flex-col">
          <div className="w-full h-[460px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-inner">
            <iframe
              src={`${packageData.pdfUrl}#toolbar=0`}
              title="Generated Package Preview"
              className="w-full h-full border-0"
            />
          </div>

          {/* Highlights summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.coverPageIncluded} (p. 1)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.indexPageIncluded} (p. 2)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t.allFootersAdded}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={packageData.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 flex items-center space-x-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open PDF in Full Browser Window</span>
          </a>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadPackage.replace('<tender_id>', tender?.tender_id || 'Tender')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
