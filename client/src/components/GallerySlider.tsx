import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Image as ImageIcon,
  MessageCircle,
  Pause,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { GalleryImage } from '../types';
import { Lightbox } from './Lightbox';
import { resolveServiceForItem } from '../utils/serviceResolver';

interface GallerySliderProps {
  onOpenWhatsAppModal: () => void;
}

const CATEGORIES = [
  'All',
  'Banquet Interiors',
  'Wedding Events',
  'Decorations',
  'Celebrations',
  'Stage Arrangements',
  'Other Events',
];

export const GallerySlider: React.FC<GallerySliderProps> = ({
  onOpenWhatsAppModal,
}) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const allImages = content?.gallery || [];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);

  const filteredImages =
    activeCategory === 'All'
      ? allImages
      : allImages.filter((img) => img.category === activeCategory);

  // Auto sliding timer
  useEffect(() => {
    if (!isAutoPlaying || filteredImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredImages.length]);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const nextSlide = () => {
    if (filteredImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevSlide = () => {
    if (filteredImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const services = content?.services || [];
  const enrichedGalleryImages: GalleryImage[] = useMemo(() => {
    return filteredImages.map((img) => {
      const resolved = resolveServiceForItem(img, services);
      return {
        ...img,
        service_slug: resolved?.slug || img.service_slug,
        target_url: resolved?.url,
        service_title: resolved?.title,
      };
    });
  }, [filteredImages, services]);

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl(
    'Hello Hriday Banquet Hall, I am viewing your Banquet Gallery on the website and would like to receive a quotation for our upcoming event.'
  );

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <ImageIcon className="w-3.5 h-3.5 text-gold-300" />
            <span>Banquet Gallery</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight leading-tight mb-4">
            A Glimpse into Real Celebrations
          </h2>

          <p className="text-charcoal-800 text-base sm:text-lg font-normal leading-relaxed">
            Browse through authentic photographs of our hall, customized stage arrangements, table styling, and memorable events.
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#650A25] to-transparent mx-auto mt-6" />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2 mb-8 sm:mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 min-h-[40px] rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#650A25] text-gold-100 shadow-md border border-gold-400/70 scale-105'
                  : 'bg-white text-charcoal-800 border border-charcoal-300 hover:bg-gold-50 hover:text-[#390014]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-charcoal-200">
            <ImageIcon className="w-12 h-12 text-charcoal-600 mx-auto mb-3" />
            <p className="text-charcoal-800 font-semibold">No images uploaded in this category yet.</p>
          </div>
        ) : (
          <div>
            {/* Main Featured Image Slider */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-300/80 aspect-[4/3] sm:aspect-[16/9] max-h-[600px] w-full bg-charcoal-950 group select-none"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Active Image */}
              <img
                src={filteredImages[currentIndex]?.image_url}
                alt={`${filteredImages[currentIndex]?.title || 'Banquet Interior'} - Hriday Banquet Hall Photography`}
                className="w-full h-full object-cover transition-all duration-700 ease-out cursor-pointer"
                onClick={() => openLightbox(currentIndex)}
              />

              {/* Top & Bottom Scrims */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/65 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-44 sm:h-48 bg-gradient-to-t from-[#120B0F]/95 via-[#120B0F]/70 to-transparent pointer-events-none" />

              {/* Left / Right Navigation Buttons (Positioned above bottom caption on mobile) */}
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-[40%] sm:top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white backdrop-blur-md border border-gold-400/50 flex items-center justify-center transition opacity-95 md:opacity-0 md:group-hover:opacity-100 shadow-lg cursor-pointer z-10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-[40%] sm:top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white backdrop-blur-md border border-gold-400/50 flex items-center justify-center transition opacity-95 md:opacity-0 md:group-hover:opacity-100 shadow-lg cursor-pointer z-10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Top Controls: Category & Lightbox Trigger */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <span className="px-3.5 py-1 bg-[#390014]/90 border border-gold-400/60 text-gold-200 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow">
                  {filteredImages[currentIndex]?.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-2 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white border border-gold-400/40 backdrop-blur-md transition cursor-pointer shadow"
                    title={isAutoPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                    aria-label="Toggle Auto-slide"
                  >
                    {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => openLightbox(currentIndex)}
                    className="p-2 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white border border-gold-400/40 backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold px-3 cursor-pointer shadow"
                    title="Open Fullscreen Lightbox"
                    aria-label="Fullscreen View"
                  >
                    <Maximize2 className="w-4 h-4 text-gold-300" />
                    <span className="hidden sm:inline">View Large</span>
                  </button>
                </div>
              </div>

              {/* Bottom Caption & Pagination */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                <div className="max-w-xl text-white">
                  <h3 className="font-serif text-lg sm:text-3xl font-bold text-white drop-shadow">
                    {filteredImages[currentIndex]?.title}
                  </h3>
                  {filteredImages[currentIndex]?.description && (
                    <p className="text-xs sm:text-sm text-ivory-50 drop-shadow font-normal line-clamp-2 mt-1">
                      {filteredImages[currentIndex]?.description}
                    </p>
                  )}
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5 bg-[#180007]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-400/40 self-start sm:self-end shrink-0">
                  {filteredImages.slice(0, 10).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? 'w-6 bg-gold-400' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                  {filteredImages.length > 10 && (
                    <span className="text-[11px] font-semibold text-gold-200 ml-1">+{filteredImages.length - 10}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    idx === currentIndex
                      ? 'border-gold-500 scale-105 shadow-gold-sm'
                      : 'border-transparent opacity-80 hover:opacity-100 hover:border-gold-300'
                  }`}
                  aria-label={`Preview ${img.title}`}
                >
                  <img
                    src={img.image_url}
                    alt={`${img.title} Thumbnail - Hriday Banquet Hall`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {/* Gallery Quotation Banner - WhatsApp Exclusive */}
            <div className="mt-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-maroon-900 via-maroon-950 to-charcoal-950 text-white border border-gold-400/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Quotation Desk</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gold-300 mb-2">
                  Envisioning Your Special Day with Us?
                </h3>
                <p className="text-sm text-ivory-100 font-normal leading-relaxed">
                  Send us your preferred event date on WhatsApp to receive a customized decoration, catering, and venue quotation instantly.
                </p>
              </div>

              {/* Standout WhatsApp Button */}
              <div className="shrink-0 w-full md:w-auto flex justify-center">
                {hasWhatsApp && waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-base whitespace-nowrap rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2.5 sm:gap-3 border border-emerald-200/40 group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                    <span>Get Quotation on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                ) : (
                  <button
                    onClick={onOpenWhatsAppModal}
                    className="w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-base whitespace-nowrap rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2.5 sm:gap-3 border border-emerald-200/40 group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
                    <span>Get Quotation on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={enrichedGalleryImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % enrichedGalleryImages.length)}
        onPrev={() =>
          setLightboxIndex((prev) => (prev - 1 + enrichedGalleryImages.length) % enrichedGalleryImages.length)
        }
        onOpenWhatsAppModal={onOpenWhatsAppModal}
      />
    </section>
  );
};
