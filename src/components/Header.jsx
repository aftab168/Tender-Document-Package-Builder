import React from 'react';
import { 
  FileText, 
  Globe, 
  Save, 
  Upload, 
  FileSpreadsheet, 
  Stamp, 
  Sparkles, 
  RotateCcw, 
  FolderCheck,
  FileCode
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function Header({
  lang,
  setLang,
  onLoadSampleData,
  onLoadSampleFiles,
  onReset,
  onExportProject,
  onImportProject,
  onExportExcel,
  onExportCSV,
  onOpenSealModal,
  onOpenAiModal,
  hasTenderData
}) {
  const t = translations[lang] || translations.en;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-2 ring-white/10">
              <span className="font-black text-white text-lg tracking-tight">MT</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  AI DevFest 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-2">
            
            {/* Load Samples Quick Buttons */}
            <div className="hidden lg:flex items-center space-x-2 mr-2">
              <button
                onClick={onLoadSampleData}
                title="Load sample tender requirements.json"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                <FolderCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.loadSampleData}</span>
              </button>

              <button
                onClick={onLoadSampleFiles}
                title="Load sample PDF documents pool"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5 text-teal-400" />
                <span>{t.loadSampleFiles}</span>
              </button>
            </div>

            {/* Checklist Exporters */}
            <div className="hidden sm:flex items-center space-x-1">
              <button
                onClick={onExportExcel}
                disabled={!hasTenderData}
                title={t.exportChecklistExcel}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-400 border border-slate-700 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={onExportCSV}
                disabled={!hasTenderData}
                title={t.exportChecklistCSV}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-400 border border-slate-700 transition"
              >
                <FileCode className="w-4 h-4" />
              </button>
            </div>

            {/* Seal & AI Helpers */}
            <button
              onClick={onOpenSealModal}
              title={t.sealSignature}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/80 text-xs font-medium transition"
            >
              <Stamp className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{t.sealSignature}</span>
            </button>

            <button
              onClick={onOpenAiModal}
              title={t.aiAssistant}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-800/80 text-xs font-medium transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">{t.aiAssistant}</span>
            </button>

            {/* Save / Open Project */}
            <button
              onClick={onExportProject}
              title={t.exportProject}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <Save className="w-4 h-4" />
            </button>

            <label
              title={t.importProject}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={onImportProject}
                className="hidden"
              />
            </label>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs rounded-md font-medium transition ${
                  lang === 'en'
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('bn')}
                className={`px-2 py-1 text-xs rounded-md font-medium transition ${
                  lang === 'bn'
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={onReset}
              title={t.resetAll}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
