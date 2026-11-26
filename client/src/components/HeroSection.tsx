import React from 'react';
import { MessageCircle, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';
import { FeaturedCelebrationsCarousel } from './FeaturedCelebrationsCarousel';

interface HeroSectionProps {
  onOpenWhatsAppModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();

  const settings = content?.settings;
  const bgImage =
    settings?.hero_bg_image ||
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85';
  const overlayOpacity = Math.min(100, Math.max(0, settings?.hero_bg_opacity ?? 45)) / 100;

  const heading = settings?.hero_heading || 'Celebrate Your Special Moments at Hriday Banquet Hall';
  const subtitle =
    settings?.hero_subtitle ||
    'An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories.';
  const trustText = settings?.hero_trust_text || 'Your Celebrations, Our Commitment.';

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    trackWhatsAppClick('hero', { placement_label: 'Hero Main CTA' });
    if (!hasWhatsApp || !waUrl) {
      e.preventDefault();
      onOpenWhatsAppModal();
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal-950">
      {/* Background Image with Parallax-like fit and Dark Luxury Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Hriday Banquet Hall Luxury Interior"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Deep luxury burgundy and charcoal gradients with admin-adjustable opacity */}
        <div
          className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B0F] via-[#26000D]/80 to-[#180007]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#120B0F]/85 via-[#180007]/55 to-[#26000D]/55" />
        </div>
      </div>

      {/* Decorative Gold Ambient Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-40 z-10" />

      {/* Hero Content - 2-Column Responsive Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (lg:col-span-7): Headline, Subtext, Trust badge, WhatsApp CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Trust-oriented Subtitle Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#390014]/85 border border-gold-300/60 text-gold-200 text-[10px] sm:text-sm font-bold tracking-wider sm:tracking-widest uppercase shadow-gold-sm backdrop-blur-md whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-300 animate-spin-slow shrink-0" />
              <span>{trustText}</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-lg">
              {heading}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-lg text-ivory-50 font-normal leading-relaxed max-w-2xl drop-shadow">
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pt-2">
              {/* Standout WhatsApp CTA Button */}
              {hasWhatsApp && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('hero', { placement_label: 'Hero Main CTA' })}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2.5 shadow-xl border border-emerald-200/40"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Get a Quotation on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2.5 shadow-xl border border-emerald-200/40 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Get a Quotation on WhatsApp</span>
                </button>
              )}

              {/* Explore Our Venue */}
              <a
                href="#facilities"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-ivory-50 hover:bg-white text-[#26000D] font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group backdrop-blur-sm shadow-lg border border-gold-300/60"
              >
                <span>Explore Our Venue</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Feature Highlights Quick Pill Strip */}
            <div className="pt-6 border-t border-gold-400/25 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-[#26000D]/75 border border-gold-400/35 backdrop-blur-md shadow">
                <span className="block font-serif text-sm sm:text-base font-bold text-gold-300">Grand Weddings</span>
                <span className="text-[11px] sm:text-xs text-ivory-100 font-medium tracking-wide">Royal Ambiance</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#26000D]/75 border border-gold-400/35 backdrop-blur-md shadow">
                <span className="block font-serif text-sm sm:text-base font-bold text-gold-300">Intimate Events</span>
                <span className="text-[11px] sm:text-xs text-ivory-100 font-medium tracking-wide">Custom Decor</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#26000D]/75 border border-gold-400/35 backdrop-blur-md shadow">
                <span className="block font-serif text-sm sm:text-base font-bold text-gold-300">Corporate Meets</span>
                <span className="text-[11px] sm:text-xs text-ivory-100 font-medium tracking-wide">Executive Layout</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#26000D]/75 border border-gold-400/35 backdrop-blur-md shadow">
                <span className="block font-serif text-sm sm:text-base font-bold text-gold-300">Dedicated Team</span>
                <span className="text-[11px] sm:text-xs text-ivory-100 font-medium tracking-wide">Seamless Service</span>
              </div>
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Floating Featured Celebrations Showcase */}
          <div className="lg:col-span-5 w-full">
            <FeaturedCelebrationsCarousel onOpenWhatsAppModal={onOpenWhatsAppModal} />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#facilities"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gold-200 hover:text-white transition-colors flex flex-col items-center gap-1 z-10 hidden sm:flex"
        aria-label="Scroll down to Facilities section"
      >
        <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
};
