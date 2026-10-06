import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  XCircle, 
  Calendar, 
  Eye, 
  Unlink, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function RequirementsTable({
  requirements,
  matches,
  uploadedFiles,
  statuses,
  lang,
  onMatchChange,
  onExpiryChange,
  onPreviewFile,
  submissionDeadline
}) {
  const t = translations[lang] || translations.en;
  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);

  // Status badge renderer
  const renderStatusBadge = (statusObj, req) => {
    switch (statusObj.status) {
      case 'OK':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.statusOK}</span>
          </div>
        );
      case 'Expired':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold animate-pulse-subtle">
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>{t.statusExpired}</span>
          </div>
        );
      case 'Expiry date needed':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.statusExpiryNeeded}</span>
          </div>
        );
      case 'Not provided':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">
            <span>{t.statusNotProvided}</span>
          </div>
        );
      case 'Missing':
      default:
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>{t.statusMissing}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Title */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.documentRequirements}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Check all mandatory documents and expiry validity against {submissionDeadline}
            </p>
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">{t.order}</th>
              <th className="py-3.5 px-4">{t.requirementTitle}</th>
              <th className="py-3.5 px-4">{t.matchedFile}</th>
              <th className="py-3.5 px-4 min-w-[150px]">{t.expiryDate}</th>
              <th className="py-3.5 px-4 text-center">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedRequirements.map((req) => {
              const matchedFileId = matches[req.id];
              const matchedFile = uploadedFiles.find(f => f.id === matchedFileId);
              const statusObj = statuses[req.id] || { status: 'Missing', blocks: req.mandatory };
              
              // Determine other files that are already matched to OTHER requirements
              const isFileTakenByOther = (fileId) => {
                return Object.entries(matches).some(([rId, fId]) => rId !== req.id && fId === fileId);
              };

              return (
                <tr 
                  key={req.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                    statusObj.blocks
                      ? 'bg-red-50/20 dark:bg-red-950/10'
                      : statusObj.status === 'OK'
                        ? 'bg-emerald-50/10 dark:bg-emerald-950/10'
                        : ''
                  }`}
                >
                  {/* Order column */}
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 inline-flex items-center justify-center font-mono text-xs">
                      {req.order}
                    </span>
                  </td>

                  {/* Requirement Title and Tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {lang === 'bn' ? req.title_bn : req.title_en}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          [{req.id}]
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 mt-1">
                        {req.mandatory ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            {t.mandatoryTag}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {t.optionalTag}
                          </span>
                        )}

                        {req.has_expiry && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center space-x-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{t.hasExpiryTag}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Matched File Dropdown & Controls */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={matchedFileId || ''}
                        onChange={(e) => onMatchChange(req.id, e.target.value || null)}
                        className="w-full sm:max-w-xs text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      >
                        <option value="">{lang === 'bn' ? '-- কোনো ফাইল সংযুক্ত নেই --' : '-- No file attached --'}</option>
                        {uploadedFiles.map((file) => {
                          const taken = isFileTakenByOther(file.id);
                          return (
                            <option
                              key={file.id}
                              value={file.id}
                              disabled={taken || file.isDuplicateCopy}
                            >
                              {file.name} ({file.pageCount} pg) {taken ? ' [In use]' : ''} {file.isDuplicateCopy ? ' [Duplicate]' : ''}
                            </option>
                          );
                        })}
                      </select>

                      {matchedFile && (
                        <button
                          onClick={() => onPreviewFile(matchedFile)}
                          title={t.previewPDF}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {matchedFileId && (
                        <button
                          onClick={() => onMatchChange(req.id, null)}
                          title="Unmatch"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {matchedFile && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
                        <span>{matchedFile.pageCount} {t.pages}</span>
                        {matchedFile.isDuplicate && (
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            • {t.duplicateFound}
                          </span>
                        )}
                      </p>
                    )}
                  </td>

                  {/* Expiry Date Input */}
                  <td className="py-3.5 px-4">
                    {req.has_expiry ? (
                      matchedFile ? (
                        <div className="flex flex-col space-y-1">
                          <input
                            type="date"
                            value={matchedFile.expiryDate || ''}
                            onChange={(e) => onExpiryChange(matchedFile.id, e.target.value)}
                            className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                          />
                          {statusObj.status === 'Expired' && (
                            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                              Expired before deadline ({submissionDeadline})
                            </span>
                          )}
                          {statusObj.status === 'Expiry date needed' && (
                            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              Please enter expiry date
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Attach file first
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {renderStatusBadge(statusObj, req)}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
