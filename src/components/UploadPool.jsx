import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Copy, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileStack,
  Layers,
  HelpCircle
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function UploadPool({
  uploadedFiles,
  requirements,
  matches,
  lang,
  onUploadPDFs,
  onRemoveFile,
  onAutoMatch,
  onPreviewFile,
  onLoadSampleFiles
}) {
  const t = translations[lang] || translations.en;
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadPDFs(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      
      {/* Header with Title and Auto-match */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
            <FileStack className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.uploadedFiles}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.totalFilesUploaded}: <span className="font-semibold text-slate-700 dark:text-slate-300">{uploadedFiles.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Load sample files */}
          <button
            onClick={onLoadSampleFiles}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Layers className="w-3.5 h-3.5 text-teal-500" />
            <span>{t.loadSampleFiles}</span>
          </button>

          {/* Auto Match Button */}
          <button
            onClick={onAutoMatch}
            disabled={uploadedFiles.length === 0}
            title={t.autoMatchHint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{t.autoMatchAll}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`my-4 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition ${
          isDragging
            ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 scale-[0.99]'
            : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-600 bg-slate-50/50 dark:bg-slate-800/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUploadPDFs(e.target.files);
            }
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-1.5">
          <Upload className={`w-6 h-6 ${isDragging ? 'text-cyan-600 animate-bounce' : 'text-slate-400'}`} />
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
            {t.dragPDFs}
          </p>
          <p className="text-[11px] text-slate-400">
            {t.supportedFormats}
          </p>
        </div>
      </div>

      {/* Uploaded Files Grid / List */}
      {uploadedFiles.length === 0 ? (
        <div className="py-6 text-center text-slate-400 text-xs italic">
          No files uploaded yet. Drag and drop PDF documents above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
          {uploadedFiles.map((file) => {
            // Find if this file is assigned to any requirement
            const assignedReqId = Object.keys(matches).find(k => matches[k] === file.id);
            const assignedReq = assignedReqId ? requirements.find(r => r.id === assignedReqId) : null;

            return (
              <div
                key={file.id}
                className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                  file.isDuplicate
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60'
                }`}
              >
                <div>
                  {/* File Title and Page Count */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2 min-w-0">
                      <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span>{file.pageCount} {t.pages}</span>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => onPreviewFile(file)}
                        title={t.previewPDF}
                        className="p-1 rounded-md text-slate-400 hover:text-cyan-600 hover:bg-white dark:hover:bg-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFile(file.id)}
                        title={t.removeFile}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Duplicate Notice Badge */}
                  {file.isDuplicate && (
                    <div className="mt-2 px-2 py-1 rounded bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] flex items-center space-x-1">
                      <Copy className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {t.duplicateFound}: {file.duplicateOf}
                      </span>
                    </div>
                  )}
                </div>

                {/* Assignment Status Footer */}
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  {assignedReq ? (
                    <span className="inline-flex items-center space-x-1 font-medium text-teal-700 dark:text-teal-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">
                        {assignedReq.order}. {lang === 'bn' ? assignedReq.title_bn : assignedReq.title_en}
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      {t.unmatched}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {file.id.substring(0, 6)}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
