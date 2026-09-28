import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, X, Check, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Compresses an image file using an offscreen HTML5 Canvas
 * Reduces large 5MB+ photos to ~60KB-140KB clean Base64 data URL
 */
const compressImage = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg data url
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const ImageUploadInput = ({
  value = '',
  onChange,
  label = 'Product Image',
  required = false,
  presets = [],
}) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileDetails, setFileDetails] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const originalSizeKb = Math.round(file.size / 1024);
      const compressedDataUrl = await compressImage(file, 1200, 0.85);

      setFileDetails({
        name: file.name,
        size: originalSizeKb > 1024 ? `${(originalSizeKb / 1024).toFixed(1)} MB` : `${originalSizeKb} KB`,
      });

      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      setUploadError('Failed to process image file. Please try another image.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleClearImage = () => {
    onChange('');
    setFileDetails(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Header with Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-300">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>

        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            id="tab-upload-from-computer"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-amber-600 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload from Computer</span>
          </button>

          <button
            type="button"
            id="tab-enter-image-url"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'url'
                ? 'bg-amber-600 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Image URL / Path</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Mode 1: Upload from Computer */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="product-image-file-input"
          />

          {!value ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 bg-slate-950/70 hover:border-amber-500/60 hover:bg-slate-900'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-200 mb-1">
                {uploading ? 'Compressing and processing photo...' : 'Click to upload or drag & drop image'}
              </p>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP from your computer or phone (Auto-optimized)
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-700 bg-black/40 shrink-0">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>Image Selected & Ready</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 truncate max-w-xs mt-0.5">
                    {fileDetails?.name || (value.startsWith('data:') ? 'Uploaded Image' : value)}
                  </p>
                  {fileDetails?.size && (
                    <span className="text-[10px] text-slate-500 font-mono">Original: {fileDetails.size}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Another</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Enter URL or Local Path */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          {/* Note: changed type="url" to type="text" to support local paths like /images/products/... */}
          <div className="relative">
            <input
              type="text"
              name="image"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/products/candy.jpg or https://..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Accepts relative website paths (e.g. <span className="font-mono text-slate-300">/images/products/...</span>) or external links.
          </p>

          {/* Quick Preview for URL mode */}
          {value && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <img
                src={value}
                alt="Preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="text-xs">
                <span className="text-slate-400">Live Preview</span>
                <p className="font-mono text-[11px] text-slate-300 truncate max-w-sm">{value}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photography Presets (if provided) */}
      {presets && presets.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Or select a high-resolution preset photo:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  value === preset.url
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <span className="text-[10px] font-bold line-clamp-1">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadInput;
