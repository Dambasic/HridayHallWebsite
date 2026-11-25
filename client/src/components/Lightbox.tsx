import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Instagram,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { GalleryImage } from '../types';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';

export interface LightboxProps {
  images: GalleryImage[];
  currentIndex?: number;
  initialImageId?: string;
  isOpen?: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onOpenWhatsAppModal?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex: externalCurrentIndex,
  initialImageId,
  isOpen = true,
  onClose,
  onNext: externalOnNext,
  onPrev: externalOnPrev,
  onOpenWhatsAppModal,
}) => {
  const { getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const location = useLocation();

  const getInitialIndex = useCallback(() => {
    if (initialImageId) {
      const idx = images.findIndex((img) => img.id === initialImageId);
      if (idx !== -1) return idx;
    }
    if (externalCurrentIndex !== undefined && externalCurrentIndex >= 0) {
      return externalCurrentIndex;
    }
    return 0;
  }, [initialImageId, externalCurrentIndex, images]);

  const [localIndex, setLocalIndex] = useState<number>(getInitialIndex);

  useEffect(() => {
    if (externalCurrentIndex !== undefined) {
      setLocalIndex(externalCurrentIndex);
    } else if (initialImageId) {
      const idx = images.findIndex((img) => img.id === initialImageId);
      if (idx !== -1) setLocalIndex(idx);
    }
  }, [externalCurrentIndex, initialImageId, images]);

  const activeIndex = externalCurrentIndex !== undefined ? externalCurrentIndex : localIndex;

  const handleNext = useCallback(() => {
    if (externalOnNext) {
      externalOnNext();
    } else {
      setLocalIndex((prev) => (prev + 1) % images.length);
    }
  }, [externalOnNext, images.length]);

  const handlePrev = useCallback(() => {
    if (externalOnPrev) {
      externalOnPrev();
    } else {
      setLocalIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [externalOnPrev, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !images.length || activeIndex < 0 || activeIndex >= images.length) {
    return null;
  }

  const currentImage = images[activeIndex];
  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl(
    `Hello Hriday Banquet Hall, I am interested in booking an event setup similar to "${currentImage.title}" (${currentImage.category}). Please share details and quotation.`
  );

  const targetServiceUrl =
    currentImage.target_url && location.pathname !== currentImage.target_url
      ? currentImage.target_url
      : null;

  const instagramUrl =
    currentImage.instagram_url && /^https?:\/\//i.test(currentImage.instagram_url)
      ? currentImage.instagram_url
      : null;

  const lightboxContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-charcoal-950/95 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.title || 'Photo viewer'}
    >
      {/* Top Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between text-white z-30 mb-3 sm:mb-4 shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3.5 py-1 bg-[#390014]/90 border border-gold-400/60 text-gold-200 rounded-full text-xs font-bold uppercase tracking-wider shadow">
            {currentImage.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 border border-white/20 text-xs sm:text-sm font-semibold text-ivory-50">
            {activeIndex + 1} / {images.length}
          </span>
        </div>

        {/* Dedicated Popup Close Button (X) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2.5 sm:p-3 rounded-full bg-[#390014]/95 hover:bg-[#650A25] text-white border-2 border-gold-400/70 transition backdrop-blur-sm cursor-pointer shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
          aria-label="Close Lightbox"
          title="Close viewer (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Content Stage with Side Arrows */}
      <div className="relative w-full max-w-5xl flex-1 flex flex-col items-center justify-center my-auto">
        {/* Navigation Arrows (isolated z-30 layer above image link) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-1 sm:left-3 top-1/3 sm:top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#180007]/90 hover:bg-[#650A25] text-white transition border border-gold-400/60 z-30 cursor-pointer shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-1 sm:right-3 top-1/3 sm:top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-[#180007]/90 hover:bg-[#650A25] text-white transition border border-gold-400/60 z-30 cursor-pointer shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Main Image Frame — Service redirect (Featured/Gallery) OR Instagram Reel redirect (Customer Reviews) */}
        {targetServiceUrl ? (
          <Link
            to={targetServiceUrl}
            onClick={onClose}
            className="group/img relative overflow-hidden rounded-2xl shadow-2xl border-2 border-gold-400/60 hover:border-gold-300 max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center bg-black/50 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            aria-label={`View ${currentImage.service_title || currentImage.title} details page`}
            title={`Open ${currentImage.service_title || currentImage.title} page`}
          >
            <img
              src={currentImage.image_url}
              alt={`${currentImage.title} - Click to open ${currentImage.service_title || 'service'} page`}
              className="max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain select-none transition-transform duration-500 group-hover/img:scale-[1.02]"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#26000D]/95 group-hover/img:bg-[#650A25] text-gold-200 group-hover/img:text-white border border-gold-400/80 text-xs font-bold tracking-wide shadow-2xl backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all">
              <span>Explore {currentImage.service_title || 'Details'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gold-300" />
            </span>
          </Link>
        ) : instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/img relative overflow-hidden rounded-2xl shadow-2xl border-2 border-pink-400/50 hover:border-pink-300 max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center bg-black/50 cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
            aria-label={`Watch ${currentImage.title} review on Instagram`}
            title="Open this customer review on Instagram"
          >
            <img
              src={currentImage.image_url}
              alt={`${currentImage.title} - Click to view on Instagram`}
              className="max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain select-none transition-transform duration-500 group-hover/img:scale-[1.02]"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#833AB4]/95 via-[#E1306C]/95 to-[#F77737]/95 group-hover/img:brightness-110 text-white border border-white/40 text-xs font-bold tracking-wide shadow-2xl backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all">
              <Instagram className="w-3.5 h-3.5" />
              <span>Watch on Instagram</span>
              <ExternalLink className="w-3 h-3 opacity-90" />
            </span>
          </a>
        ) : (
          <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gold-500/30 max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center bg-black/50">
            <img
              src={currentImage.image_url}
              alt={currentImage.title}
              className="max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain select-none"
            />
          </div>
        )}

        {/* Caption & Interactive Controls */}
        <div className="mt-4 text-center max-w-2xl px-4 flex flex-col items-center gap-2">
          <h3 className="font-serif text-xl sm:text-3xl font-bold text-white drop-shadow">
            {currentImage.title}
          </h3>
          {currentImage.description && (
            <p className="text-xs sm:text-sm text-ivory-100 max-w-xl font-normal leading-relaxed">
              {currentImage.description}
            </p>
          )}

          {/* Action Row */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {targetServiceUrl && (
              <Link
                to={targetServiceUrl}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#650A25] hover:bg-[#8B1538] text-gold-100 hover:text-white text-xs sm:text-sm font-bold rounded-full transition shadow-lg border border-gold-400/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              >
                <span>View {currentImage.service_title || 'Details'}</span>
                <ArrowUpRight className="w-4 h-4 text-gold-300" />
              </Link>
            )}

            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:brightness-110 text-white text-xs sm:text-sm font-bold rounded-full transition shadow-lg border border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              >
                <Instagram className="w-4 h-4" />
                <span>View on Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-90" />
              </a>
            )}

            {hasWhatsApp && waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick('lightbox', {
                    image_title: currentImage.title,
                    image_id: currentImage.id,
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-full transition shadow-lg border border-emerald-200/30"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire on WhatsApp</span>
              </a>
            ) : onOpenWhatsAppModal ? (
              <button
                type="button"
                onClick={() => {
                  trackWhatsAppClick('lightbox', {
                    image_title: currentImage.title,
                    image_id: currentImage.id,
                  });
                  onOpenWhatsAppModal();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-full transition shadow-lg border border-emerald-200/30 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire on WhatsApp</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(lightboxContent, document.body);
  }
  return lightboxContent;
};
