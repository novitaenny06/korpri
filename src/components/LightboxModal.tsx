import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxItem {
  url: string;
  caption?: string;
  title?: string;
}

interface LightboxModalProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !items.length) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Top Bar with counter & close */}
      <div className="flex items-center justify-between text-white z-10 w-full max-w-6xl mx-auto">
        <div className="text-xs sm:text-sm font-mono text-slate-300">
          <span>{currentIndex + 1}</span>
          <span className="mx-1 text-slate-500">/</span>
          <span>{items.length}</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Tutup pratinjau"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-2 overflow-hidden">
        {items.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentItem.url}
          alt={currentItem.caption || currentItem.title || 'Dokumentasi KORPRI'}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200 select-none"
        />

        {items.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
            aria-label="Foto selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption */}
      <div className="w-full max-w-3xl mx-auto text-center z-10 py-2">
        {currentItem.title && (
          <h4 className="text-sm font-semibold text-white tracking-tight mb-1">
            {currentItem.title}
          </h4>
        )}
        {currentItem.caption && (
          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            {currentItem.caption}
          </p>
        )}
      </div>
    </div>
  );
};
