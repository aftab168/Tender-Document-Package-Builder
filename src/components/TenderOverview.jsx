import React, { useRef } from 'react';
import { 
  Building2, 
  Calendar, 
  FileCheck2, 
  Hash, 
  UserCheck, 
  UploadCloud, 
  FileCode2,
  AlertCircle
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function TenderOverview({
  tender,
  lang,
  onLoadRequirementsFile,
  onLoadSampleData
}) {
  const t = translations[lang] || translations.en;
  const fileInputRef = useRef(null);

  if (!tender) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t.uploadRequirements}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t.dragRequirements}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm shadow-md shadow-cyan-600/20 transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onLoadRequirementsFile}
                className="hidden"
              />
              {t.uploadRequirements}
            </button>
            <button
              onClick={onLoadSampleData}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm transition"
            >
              {t.loadSampleData}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              {t.tenderDetails}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {tender.title}
            </h2>
          </div>
        </div>
        
        {/* Tender ID Badge */}
        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Hash className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t.tenderId}:</span>
          <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{tender.tender_id}</span>
        </div>
      </div>

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        
        <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.procuringEntity}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{tender.procuring_entity}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <UserCheck className="w-4 h-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.bidderName}</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{tender.bidder}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 sm:col-span-2 lg:col-span-1">
          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">{t.submissionDeadline}</p>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mt-0.5 font-mono">{tender.submission_deadline}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
