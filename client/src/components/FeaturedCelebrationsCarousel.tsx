import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Eye,
  Heart,
  ArrowUpRight,
} from 'lucide-react';
import { CelebrationItem, GalleryImage } from '../types';
import { useContent } from '../context/ContentContext';
import { Lightbox } from './Lightbox';
import { trackWhatsAppClick } from '../services/analytics';
import { resolveServiceForItem } from '../utils/serviceResolver';

interface FeaturedCelebrationsCarouselProps {
  onOpenWhatsAppModal: () => void;
}

export const FeaturedCelebrationsCarousel: React.FC<FeaturedCelebrationsCarouselProps> = ({
  onOpenWhatsAppModal,
}) => {
  const {
    content,
    featuredCelebrations,
    celebrations,
    getHridayWhatsAppUrl,
    getHridayWhatsAppNumber,
  } = useContent();

  // Use admin-featured celebrations if available; otherwise fallback to celebrations list
  const items: CelebrationItem[] =
    featuredCelebrations && featuredCelebrations.length > 0
      ? featuredCelebrations
      : celebrations && celebrations.length > 0
      ? celebrations.slice(0, 5)
      : [];

  const services = content?.services || [];

  const lightboxImages: GalleryImage[] = useMemo(() => {
    return items.map((it) => {
      const resolved = resolveServiceForItem(it, services);
      return {
        id: it.id,
        title: it.title,
        description: it.description,
        image_url: it.image_url,
        category: it.tag || 'Featured Celebration',
        display_order: it.featured_order,
        is_featured: it.is_featured,
        is_active: 1,
        created_at: it.created_at || '',
        updated_at: it.updated_at || '',
        service_slug: resolved?.slug || it.service_slug || '',
        target_url: resolved?.url,
        service_title: resolved?.title,
        instagram_url: it.instagram_url,
      };
    });
  }, [items, services]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused || lightboxOpen) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [items.length, isPaused, lightboxOpen, currentIndex]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const currentResolved = resolveServiceForItem(currentItem, services);
  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl(
    `Hello Hriday Banquet Hall, I saw your featured celebration "${currentItem.title}" on your website and would like to receive a customized quotation and package details for an upcoming event.`
  );

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleWhatsAppAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackWhatsAppClick('hero_featured_showcase', {
      celebration_id: currentItem.id,
      celebration_title: currentItem.title,
    });
    if (hasWhatsApp && waUrl) {
      window.open(waUrl, '_blank');
    } else {
      onOpenWhatsAppModal();
    }
  };

  return (
    <>
      <div className="space-y-2.5 w-full max-w-lg lg:max-w-none mx-auto">
        {/* Floating Showcase Header Label */}
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="font-bold tracking-wider uppercase text-gold-200 flex items-center gap-1.5 drop-shadow">
            <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-spin-slow" />
            <span>Featured Celebrations</span>
          </span>
          <span className="text-[10px] sm:text-xs text-ivory-50 font-mono font-semibold tracking-tight bg-[#26000D]/85 px-2.5 sm:px-3 py-1 rounded-full border border-gold-400/50 shadow whitespace-nowrap shrink-0">
            {currentIndex + 1} of {items.length} • Auto-Rotating
          </span>
        </div>

        {/* Main Floating Showcase Card Container */}
        <div
          className="bg-gradient-to-b from-[#26000D]/95 via-[#390014]/95 to-[#26000D]/95 backdrop-blur-xl rounded-3xl border-2 border-gold-400/80 shadow-2xl overflow-hidden flex flex-col group relative transition-all duration-300 hover:border-gold-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 3.5s Animated Progress Bar */}
          <div className="w-full h-1 bg-white/15 relative overflow-hidden">
            <div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 animate-hero-progress"
              style={{ animationPlayState: isPaused || lightboxOpen ? 'paused' : 'running' }}
            />
          </div>

          {/* Slide Image Header */}
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-950">
            {/* Clickable Semantic Button that opens Lightbox popup */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="w-full h-full block cursor-pointer relative focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-300"
              aria-label={`Open ${currentItem.title} photo viewer`}
              title={`Open ${currentItem.title} Photo Viewer`}
            >
              <img
                key={currentItem.id}
                src={currentItem.image_url}
                alt={`${currentItem.title} Celebration at Hriday Banquet Hall`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Subtle bottom & top scrims for crisp overlay contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#180007]/90 via-[#26000D]/25 to-black/35 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className="bg-[#390014]/95 backdrop-blur-md text-gold-200 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gold-400/60 shadow-md flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400/40" />
                  <span>{currentItem.tag || '#HridayCelebrations'}</span>
                </span>

                <span className="bg-[#26000D]/90 backdrop-blur-md text-gold-200 text-[11px] font-bold px-2.5 py-1 rounded-full border border-gold-400/60 shadow-md">
                  ★ Signature Event
                </span>
              </div>

              {/* View Hint Pill */}
              <span className="absolute bottom-3 right-3 bg-[#180007]/85 group-hover:bg-[#650A25] backdrop-blur-md text-gold-100 group-hover:text-white text-[11px] font-bold px-3 py-1 rounded-full border border-gold-400/60 flex items-center gap-1.5 shadow-lg transition-colors">
                <Eye className="w-3.5 h-3.5 text-gold-300" />
                <span>View Photo</span>
              </span>
            </button>

            {/* Prev / Next Navigation Arrows (Sibling Controls) */}
            {items.length > 1 && (
              <div className="absolute inset-y-0 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Featured Celebration"
                  className="pointer-events-auto p-2.5 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white border border-gold-400/60 backdrop-blur-md transition-all active:scale-95 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Featured Celebration"
                  className="pointer-events-auto p-2.5 rounded-full bg-[#180007]/85 hover:bg-[#650A25] text-white border border-gold-400/60 backdrop-blur-md transition-all active:scale-95 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Card Body & Actions */}
          <div className="p-5 sm:p-6 flex flex-col justify-between text-left space-y-4">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug group-hover:text-gold-200 transition-colors">
                {currentItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-ivory-100 font-normal leading-relaxed mt-1.5 line-clamp-2">
                {currentItem.description}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gold-400/25">
              {/* WhatsApp Quotation Button */}
              <button
                type="button"
                onClick={handleWhatsAppAction}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 border border-emerald-200/30 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire Package</span>
              </button>

              {/* Direct Service Details Link or Lightbox Trigger */}
              {currentResolved ? (
                <Link
                  to={currentResolved.url}
                  className="py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-gold-100 bg-white/15 hover:bg-[#650A25] border border-gold-400/50 transition-colors flex items-center gap-1.5"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-300" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold text-gold-100 bg-white/15 hover:bg-[#650A25] border border-gold-400/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-gold-300" />
                  <span>Photos</span>
                </button>
              )}
            </div>

            {/* Slide Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-gold-400'
                      : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                  aria-label={`Go to ${item.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Viewer (Clicking the opened photo navigates directly to the exact service details page!) */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          initialImageId={currentItem.id}
          onClose={() => setLightboxOpen(false)}
          onOpenWhatsAppModal={onOpenWhatsAppModal}
        />
      )}
    </>
  );
};
