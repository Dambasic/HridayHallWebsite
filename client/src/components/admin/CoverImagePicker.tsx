import React, { useState, useMemo } from 'react';
import { UploadCloud, Image as ImageIcon, Check, RotateCcw, Grid } from 'lucide-react';
import { uploadImageFile } from '../../services/api';

export interface CoverOption {
  url: string;
  label?: string;
}

interface CoverImagePickerProps {
  label: string;
  value: string;
  fallbackUrl?: string;
  onChange: (url: string) => void;
  options?: CoverOption[];
  uploadId: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  compact?: boolean;
}

/**
 * Reusable cover photo selector & uploader used wherever admins configure
 * cover images for reels, customer reviews, or service sections.
 */
export const CoverImagePicker: React.FC<CoverImagePickerProps> = ({
  label,
  value,
  fallbackUrl = '',
  onChange,
  options = [],
  uploadId,
  placeholder = 'Paste cover image URL or upload/select below',
  required = false,
  hint,
  compact = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);

  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((opt) => {
      const url = opt.url?.trim();
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    });
  }, [options]);

  const previewUrl = value.trim() || fallbackUrl.trim();
  const isUsingCustom = Boolean(value.trim());

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError('');
      const res = await uploadImageFile(file);
      onChange(res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Cover image upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-[11px] sm:text-xs font-semibold text-charcoal-800 uppercase tracking-wider">
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-charcoal-700 font-medium">{hint}</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
        {/* Thumbnail Preview */}
        <div
          className={`${
            compact ? 'w-full sm:w-28 h-20' : 'w-full sm:w-36 h-24'
          } rounded-2xl border-2 border-dashed border-gold-300 bg-ivory-50 flex items-center justify-center overflow-hidden shrink-0 relative`}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
              <span
                className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow ${
                  isUsingCustom
                    ? 'bg-[#650A25]/95 text-gold-100 border border-gold-400/60'
                    : 'bg-charcoal-950/85 text-ivory-100 border border-white/25'
                }`}
              >
                {isUsingCustom ? 'Custom Cover' : 'Service Default'}
              </span>
            </>
          ) : (
            <ImageIcon className="w-6 h-6 text-charcoal-600" />
          )}
        </div>

        {/* Input + Action Buttons */}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2 rounded-xl border border-charcoal-300 bg-white text-xs text-charcoal-900 focus:outline-none focus:border-gold-500"
          />

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id={uploadId}
            />
            <label
              htmlFor={uploadId}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#650A25] to-[#390014] hover:from-[#8B1538] hover:to-[#4A071D] text-gold-100 text-xs font-bold cursor-pointer border border-gold-400/50 shadow-sm transition"
            >
              <UploadCloud className="w-3.5 h-3.5 text-gold-300" />
              <span>{isUploading ? 'Uploading...' : 'Upload Cover Image'}</span>
            </label>

            {uniqueOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowGalleryPicker((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  showGalleryPicker
                    ? 'bg-[#390014] text-gold-100 border-[#650A25]'
                    : 'bg-ivory-100 hover:bg-gold-100 text-[#4A071D] border-gold-300'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{showGalleryPicker ? 'Hide Coverpage Options' : 'Select Coverpage'}</span>
              </button>
            )}

            {fallbackUrl && isUsingCustom && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-charcoal-50 text-charcoal-700 border border-charcoal-300 text-xs font-semibold transition cursor-pointer"
                title="Use default service cover photo"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Use Default</span>
              </button>
            )}
          </div>

          {uploadError && (
            <p className="text-[11px] font-semibold text-rose-700">{uploadError}</p>
          )}
        </div>
      </div>

      {/* Visual Gallery / Existing Cover Selector */}
      {showGalleryPicker && uniqueOptions.length > 0 && (
        <div className="p-3 bg-white rounded-2xl border border-gold-300 shadow-sm space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#4A071D]">
            Select Coverpage from Uploaded Photos ({uniqueOptions.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto pr-1">
            {uniqueOptions.map((opt) => {
              const isSelected = value.trim() === opt.url.trim();
              return (
                <button
                  key={opt.url}
                  type="button"
                  onClick={() => {
                    onChange(opt.url);
                    setShowGalleryPicker(false);
                  }}
                  title={opt.label || 'Select as coverpage'}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'border-[#650A25] ring-2 ring-gold-400'
                      : 'border-charcoal-200 hover:border-gold-500'
                  }`}
                >
                  <img
                    src={opt.url}
                    alt={opt.label || 'Cover option'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {opt.label && (
                    <span className="absolute inset-x-0 bottom-0 px-1.5 py-0.5 bg-charcoal-950/85 text-[9px] font-semibold text-ivory-100 truncate">
                      {opt.label}
                    </span>
                  )}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#650A25] text-gold-200 flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
