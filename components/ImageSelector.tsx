"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ImageIcon, X, AlertTriangle } from "@/components/ui-icons";

interface ImageSelectorProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onValidationError?: (message: string | null) => void;
  disabled?: boolean;
  error?: string | null;
  /** URL de la imagen analizada (después del análisis) */
  imageUrl?: string | null;
  /** Callback para iniciar nuevo análisis */
  onNewAnalysis?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const validExt = /\.(jpe?g|png|webp)$/i;

export default function ImageSelector({
  selectedFile,
  onFileChange,
  onValidationError,
  disabled = false,
  error = null,
  imageUrl = null,
  onNewAnalysis,
}: ImageSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const isValidFile = useCallback((file: File) => {
    return validTypes.includes(file.type) || validExt.test(file.name);
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPreviewUrl(null);

      if (!file) {
        onFileChange(null);
        return;
      }

      if (!isValidFile(file)) {
        onFileChange(null);
        onValidationError?.("Solo se permiten imágenes JPG, PNG o WebP");
        return;
      }

      onValidationError?.(null);
      onFileChange(file);
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    },
    [onFileChange, onValidationError, isValidFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    handleFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {imageUrl ? (
        <div className="rounded-[28px] border-2 border-brand-200 bg-slate-900 overflow-hidden shadow-lg shadow-brand-500/10">
          <div className="aspect-square max-h-[320px] bg-black relative">
            <img
              src={imageUrl}
              alt="CT-Scan analizado"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-300">
              Imagen CT-Scan analizada
            </p>
            {onNewAnalysis && (
              <button
                type="button"
                onClick={onNewAnalysis}
                className="shrink-0 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Nueva clasificación
              </button>
            )}
          </div>
        </div>
      ) : !selectedFile ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${isDragging ? "border-brand-500 bg-brand-50/80 scale-[1.01]" : "border-brand-200 hover:border-brand-400 hover:bg-brand-50/70"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${error ? "border-red-300 bg-red-50/30" : ""}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-700/10 pointer-events-none" />
          <div className="relative flex flex-col items-center justify-center py-10 sm:py-12 px-6 text-center min-h-[180px]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
              <ImageIcon className="w-8 h-8 text-brand-700" size={32} />
            </div>
            <p className="text-slate-700 font-semibold mb-1">
              Arrastra tu imagen CT-Scan aquí o haz clic para seleccionar
            </p>
            <p className="text-slate-500 text-sm">
              Formatos soportados: JPG, PNG, WebP
            </p>
            {isDragging && (
              <p className="mt-3 text-brand-600 text-sm font-medium animate-pulse">
                Suelta el archivo aquí
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-[28px] border-2 border-brand-200 bg-white overflow-hidden shadow-lg shadow-brand-500/10">
          <div className="relative">
            <div className="aspect-square max-h-[320px] bg-slate-900 relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-600/90 text-white text-xs font-semibold backdrop-blur-sm">
                  {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="p-2 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 shadow-md transition-colors disabled:opacity-50"
                  title="Quitar imagen"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-brand-50/70 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <span className="text-xs text-slate-500">
                {formatFileSize(selectedFile.size)}
              </span>
              <button
                type="button"
                onClick={handleClick}
                disabled={disabled}
                className="ml-auto text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
              >
                Cambiar imagen
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
