import React, { useRef, useState } from 'react';
import { 
  X, 
  Stamp, 
  Upload, 
  Check, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function SealModal({
  isOpen,
  onClose,
  sealConfig,
  setSealConfig,
  lang
}) {
  const t = translations[lang] || translations.en;
  const fileInputRef = useRef(null);

  const [pagesOption, setPagesOption] = useState(sealConfig?.pagesOption || 'declaration');
  const [position, setPosition] = useState(sealConfig?.position || 'bottomRight');
  const [previewUrl, setPreviewUrl] = useState(sealConfig?.previewUrl || null);
  const [imageBytes, setImageBytes] = useState(sealConfig?.imageBytes || null);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('png') && !file.type.includes('image')) {
      alert("Please upload a PNG image for stamp transparency.");
      return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const url = URL.createObjectURL(file);
    setImageBytes(arrayBuffer);
    setPreviewUrl(url);
  };

  const handleApply = () => {
    setSealConfig({
      imageBytes,
      previewUrl,
      pagesOption,
      position
    });
    onClose();
  };

  const handleClear = () => {
    setImageBytes(null);
    setPreviewUrl(null);
    setSealConfig(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.sealModalTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bonus Feature: Official Digital Stamp / Sign Off
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          
          {/* Upload Seal / Stamp */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.uploadSeal}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/50 transition flex flex-col items-center justify-center space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              {previewUrl ? (
                <div className="flex items-center space-x-3">
                  <img src={previewUrl} alt="Seal Preview" className="w-16 h-16 object-contain bg-white p-1 rounded-lg border border-slate-200" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Custom Stamp Image Loaded</span>
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Click to replace image</span>
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Click to upload official Seal / Signature (.png)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Page Application Option */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.selectStampPages}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'declaration', label: t.stampDeclaration },
                { id: 'cover', label: t.stampCover },
                { id: 'all', label: t.stampAll }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPagesOption(opt.id)}
                  type="button"
                  className={`p-2.5 rounded-xl border text-left font-medium transition ${
                    pagesOption === opt.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t.sealPosition}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'bottomRight', label: t.bottomRight },
                { id: 'bottomLeft', label: t.bottomLeft },
                { id: 'centerBottom', label: t.centerBottom },
                { id: 'topRight', label: t.topRight }
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setPosition(pos.id)}
                  type="button"
                  className={`p-2 rounded-lg border text-center transition ${
                    position === pos.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
          >
            Remove Stamp
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              Save Seal Config
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
