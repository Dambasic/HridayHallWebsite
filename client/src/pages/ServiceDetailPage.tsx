import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Instagram,
  Play,
  ExternalLink,
  Eye,
  Camera,
  Calendar,
  Phone,
  ShieldCheck,
  Check,
  Clock,
  Heart
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { Lightbox } from '../components/Lightbox';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';
import { fetchServiceBySlug } from '../services/api';
import { ServiceItem, ServiceGalleryImage, ServiceInstagramMedia } from '../types';
import { SEOHead } from '../components/SEOHead';
import { getServicePageSchema } from '../utils/seoSchema';
import { resolveInstagramUrl } from '../utils/socialLinks';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const igLink = resolveInstagramUrl(content) || 'https://www.instagram.com/hridaybanquetspineroad/';
  const igHandle = content?.social?.find((s) => s.platform === 'instagram')?.handle || '@hridaybanquetspineroad';

  const [service, setService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImageId, setLightboxImageId] = useState<string | null>(null);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchServiceBySlug(slug)
      .then((data) => {
        if (isMounted) {
          setService(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load service detail:', err);
          setError(err.message || 'Service not found');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const serviceTitle = service?.title || 'Celebration';

  const defaultQuotationMessage = `Hello Hriday Banquet Hall Team,

I visited your website and would like to enquire about hosting our ${serviceTitle} at your venue.

Please share your available package options, pricing details, menu selections, and date availability.

Kindly send me the customized quotation directly on WhatsApp.

Thank you!`;

  const waUrl = getHridayWhatsAppUrl(defaultQuotationMessage);

  const handleWhatsAppAction = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    trackWhatsAppClick('service_detail', { service: serviceTitle, slug: service?.slug });
    if (hasWhatsApp && waUrl) {
      window.open(waUrl, '_blank');
    } else {
      setWhatsAppModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between">
        <Navbar onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-gold-400 border-t-[#650A25] animate-spin" />
            <h2 className="font-serif text-2xl font-bold text-[#390014]">
              Hriday Banquet Hall
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#650A25] font-bold">
              Loading Service Experience...
            </p>
          </div>
        </div>
        <Footer onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between">
        <Navbar onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border-2 border-gold-300 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#390014] mb-2">
              Service Not Found
            </h2>
            <p className="text-sm text-charcoal-800 mb-6 font-medium">
              We couldn&apos;t find the celebration service you requested. It might have been updated or moved.
            </p>
            <Link
              to="/#facilities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#650A25] hover:bg-[#390014] text-white text-sm font-bold transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Services</span>
            </Link>
          </div>
        </div>
        <Footer onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
      </div>
    );
  }

  // Parse features
  const featuresList: string[] = Array.isArray(service.features)
    ? service.features
    : typeof service.features === 'string'
    ? (() => {
        try {
          return JSON.parse(service.features);
        } catch {
          return [];
        }
      })()
    : [];

  const galleryItems: ServiceGalleryImage[] = service.gallery || [];
  const instagramItems: ServiceInstagramMedia[] = service.instagram_media || [];

  const pageTitle = `${service.title} in Pimpri Chinchwad | Hriday Banquet Hall`;
  const pageDescription =
    service.short_description ||
    `Host your ${service.title} at Hriday Banquet Hall in Pimpri Chinchwad. Elegant banquet spaces, royal stage decor, delicious catering, and dedicated event support.`;
  const schema = getServicePageSchema(service, content);

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-charcoal-900 selection:bg-gold-200 selection:text-maroon-950 font-sans">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`${service.title}, ${service.title} in Pimpri Chinchwad, banquet hall for ${service.title.toLowerCase()}, Hriday Banquet Hall events`}
        canonicalUrl={`https://hridaybanquethall.com/services/${service.slug}`}
        ogImage={service.image_url}
        ogType="article"
        schema={schema}
      />

      <Navbar onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />

      {/* 1. HERO COVER SECTION (BURGUNDY & GOLD LUXURY BANNER) */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-[#26000D] text-white border-b-2 border-gold-400/40">
        {/* Background Image with Deep Burgundy & Wine Luxury Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover object-center brightness-[0.35] transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#180007] via-[#390014]/85 to-[#26000D]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#650A25]/40 via-transparent to-[#180007]/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation - Crisp & Clear */}
          <div className="mb-6">
            <Link
              to="/#facilities"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300 hover:text-white transition bg-[#390014]/90 hover:bg-[#650A25] backdrop-blur-md px-4 py-2 rounded-full border border-gold-400/60 shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-gold-300" />
              <span>All Facilities &amp; Services</span>
            </Link>
          </div>

          <div className="max-w-3xl">
            {/* Category Pill in Burgundy & Gold */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border-2 border-gold-400 text-gold-200 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>{service.category || 'Celebration Experience'}</span>
            </div>

            {/* Service Main Title */}
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-5 drop-shadow-md">
              {service.title}
            </h1>

            {/* Short Introduction - Crisp, High-Contrast Text */}
            <p className="text-base sm:text-xl text-ivory-100 font-normal leading-relaxed mb-8 drop-shadow">
              {service.short_description || service.description}
            </p>

            {/* Hero Quick CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsAppAction}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 transition-all shadow-xl hover:shadow-2xl border border-emerald-200/40 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Get a Quotation on WhatsApp</span>
              </button>

              <a
                href="#gallery-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-gold-200 bg-[#390014]/90 hover:bg-[#650A25] hover:text-white backdrop-blur-md border border-gold-400/60 transition shadow-md"
              >
                <Camera className="w-4 h-4 text-gold-300" />
                <span>View Event Gallery</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GALLERY AT TOP (REAL EVENT PHOTOS WITH LIGHTBOX) */}
      <section id="gallery-section" className="py-16 sm:py-24 bg-[#FFF9F0] border-b-2 border-gold-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <Camera className="w-3.5 h-3.5 text-gold-300" />
              <span>Real Event Photography</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight">
              {service.title} Gallery
            </h2>

            <p className="text-sm sm:text-base text-charcoal-800 font-medium mt-3 leading-relaxed">
              Explore authentic stage arrangements, chandeliers, banquet seating, and celebration decors hosted at Hriday Banquet Hall.
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#650A25] to-transparent mx-auto mt-5" />
          </div>

          {/* Photo Grid */}
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryItems.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImageId(img.id)}
                  className="group relative cursor-pointer aspect-[4/3] rounded-3xl overflow-hidden bg-charcoal-900 border-2 border-gold-300/80 shadow-luxury hover:shadow-2xl hover:border-gold-500 transition-all duration-300 transform hover:-translate-y-1.5"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Subtle always-visible bottom gradient bar for caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180007]/90 via-[#390014]/40 to-transparent opacity-70 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5 text-white">
                    <p className="text-xs sm:text-sm font-bold text-white mb-1 drop-shadow-md">
                      {img.caption || service.title}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs text-gold-300 font-bold group-hover:translate-x-1 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-gold-400" />
                      <span>Click to Enlarge</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gold-300 max-w-lg mx-auto shadow-sm">
              <Camera className="w-10 h-10 text-gold-600 mx-auto mb-3" />
              <p className="text-sm text-charcoal-800 font-medium">
                Gallery photographs for {service.title} are being updated by management.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. REELS & VIDEOS SECTION (INSTAGRAM REELS NEXT) */}
      <section id="reels-section" className="py-16 sm:py-24 bg-white border-b-2 border-gold-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
                <Instagram className="w-3.5 h-3.5 text-pink-300" />
                <span>Instagram Reels &amp; Videos</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight">
                Watch Real Celebrations
              </h2>

              <p className="text-sm sm:text-base text-charcoal-800 font-medium mt-3 leading-relaxed">
                Grand entries, fireworks, live dining setups, and decor reveals captured live on our official Instagram channel.
              </p>
            </div>

            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#650A25] via-pink-700 to-purple-800 hover:from-[#390014] hover:to-purple-900 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-xl hover:scale-105 shrink-0 border border-gold-400/40"
            >
              <Instagram className="w-4 h-4 text-pink-200" />
              <span>Follow {igHandle}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>

          {/* Video Cards Grid */}
          {instagramItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instagramItems.map((item) => (
                <a
                  key={item.id}
                  href={item.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[#FFF9F0] rounded-3xl overflow-hidden border-2 border-gold-200 hover:border-gold-400 shadow-luxury hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                >
                  {/* Thumbnail Cover */}
                  <div className="relative aspect-[16/10] bg-[#180007] overflow-hidden">
                    <img
                      src={item.cover_image || service.image_url}
                      alt={item.title || `${service.title} Reel`}
                      className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180007]/90 via-[#390014]/40 to-transparent" />

                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#650A25] text-gold-200 border-2 border-gold-400 flex items-center justify-center shadow-2xl transform group-hover:scale-115 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5 text-gold-300" />
                      </div>
                    </div>

                    <span className="absolute top-3 right-3 px-3 py-1 bg-[#180007]/90 backdrop-blur-md border border-gold-400/60 text-gold-300 text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>{item.media_type === 'reel' ? 'Reel' : 'Video'}</span>
                    </span>
                  </div>

                  {/* Body Content - Crisp & High Contrast */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#390014] mb-2 group-hover:text-[#650A25] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-charcoal-800 font-normal leading-relaxed line-clamp-3">
                        {item.caption}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gold-200/60 flex items-center justify-between text-xs font-bold text-[#650A25] group-hover:text-[#390014]">
                      <span>Watch Reel on Instagram</span>
                      <ExternalLink className="w-4 h-4 text-pink-600" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FFF9F0] rounded-3xl border-2 border-dashed border-gold-300 max-w-lg mx-auto shadow-sm">
              <Instagram className="w-10 h-10 text-[#650A25] mx-auto mb-3" />
              <p className="text-sm text-charcoal-800 font-semibold mb-4">
                Follow our official Instagram page to view ongoing celebration reels and video updates.
              </p>
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#650A25] hover:bg-[#390014] text-white text-xs font-bold transition shadow"
              >
                <span>Visit Instagram Feed</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 4. CONTENT WITH QUOTATION BUTTON SECTION */}
      <section id="experience-section" className="py-20 sm:py-28 bg-[#FFF9F0] relative overflow-hidden">
        {/* Decorative Gold Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#650A25]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Full Description & Inclusions Checklist */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                  <span>The Hriday Experience</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#390014] leading-tight mb-5">
                  Where Every {service.title} Becomes a Timeless Celebration
                </h2>

                {/* High Contrast Full Description */}
                <p className="text-charcoal-900 text-base sm:text-lg font-normal leading-relaxed">
                  {service.full_description || service.description}
                </p>
              </div>

              {/* Dedicated Arrangement Highlights Cards */}
              {featuresList.length > 0 && (
                <div className="pt-2">
                  <h3 className="font-serif text-2xl font-bold text-[#390014] mb-4 flex items-center gap-2">
                    <span>What&apos;s Included in Our Venue Arrangements:</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {featuresList.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border-l-4 border-l-[#650A25] border border-gold-200/80 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-charcoal-900 font-semibold leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Prominent Burgundy Quotation Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-gradient-to-br from-[#390014] via-[#4A071D] to-[#26000D] text-white rounded-3xl p-8 sm:p-10 border-2 border-gold-400 shadow-2xl relative overflow-hidden">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* WhatsApp Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 shadow-gold-md">
                  <MessageCircle className="w-7 h-7 text-[#26000D] fill-current" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold uppercase tracking-wider mb-2 border border-gold-400/40">
                  <Sparkles className="w-3 h-3 text-gold-300" />
                  <span>Direct Reservations</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
                  Book Your {service.title}
                </h3>

                {/* Crisp text */}
                <p className="text-sm text-ivory-100 font-normal leading-relaxed mb-6">
                  Receive customized package options, decor styling themes, and hall availability dates directly on your WhatsApp.
                </p>

                {/* Perks Checklist */}
                <div className="space-y-3 mb-8 text-xs sm:text-sm text-ivory-100 font-medium">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Instant quotation tailored to your guest headcount</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Direct discussion with venue coordinator</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-gold-300 shrink-0" />
                    <span>Zero booking fees or agent commission</span>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <button
                  onClick={handleWhatsAppAction}
                  className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 border border-emerald-200/40 cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6 fill-current" />
                  <span>Request Quotation on WhatsApp</span>
                </button>

                <p className="text-xs text-center text-gold-200 mt-4 font-medium flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-300" />
                  <span>Banquet team typically responds within minutes</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
      <FloatingWhatsApp onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />

      {/* Lightbox for Gallery */}
      {lightboxImageId && (
        <Lightbox
          images={galleryItems.map((g) => ({
            id: g.id,
            title: g.caption || service.title,
            description: '',
            image_url: g.image_url,
            category: service.title,
            display_order: g.display_order,
            is_featured: 0,
            is_active: 1,
            created_at: '',
            updated_at: '',
          }))}
          initialImageId={lightboxImageId}
          onClose={() => setLightboxImageId(null)}
        />
      )}

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        brandName="Hriday Banquet Hall"
        phoneNumber={content?.contact?.phone_number || ''}
      />
    </div>
  );
};
