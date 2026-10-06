import React from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';

export default function PreviewModal({ file, onClose }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
              {file.name}
            </h3>
            <span className="text-xs text-slate-500 font-medium">({file.pageCount} pages)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2">
          {file.url ? (
            <iframe
              src={file.url}
              title={file.name}
              className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              No preview available
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
