import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  MessageCircle,
  Instagram,
  Facebook,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';
import { resolveInstagramUrl } from '../utils/socialLinks';

interface ContactSectionProps {
  onOpenWhatsAppModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();

  const contact = content?.contact;
  const venueName = contact?.venue_name || 'Hriday Banquet Hall';
  const fullAddress = contact?.full_address || 'Main Road, City Center (Configurable via Admin)';
  const phoneNumber = contact?.phone_number || '';
  const emailAddress = contact?.email_address || '';
  const openingHours = contact?.opening_hours || 'Monday – Sunday: 10:00 AM – 10:00 PM';
  const mapsEmbedUrl = contact?.google_maps_embed_url || '';
  const directionsUrl = contact?.google_maps_directions_url || 'https://maps.google.com';

  const igLink = resolveInstagramUrl(content) || 'https://instagram.com';
  const fbLink = content?.social?.find((s) => s.platform === 'facebook')?.url || 'https://facebook.com';

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl();

  const handleWhatsAppClick = (customMsg?: string) => {
    trackWhatsAppClick('contact', { custom_message: customMsg || 'General Inquiry' });
    if (!hasWhatsApp) {
      onOpenWhatsAppModal();
      return;
    }

    const url = getHridayWhatsAppUrl(customMsg);
    if (url) {
      window.open(url, '_blank');
    } else {
      onOpenWhatsAppModal();
    }
  };

  const quickEnquiryPresets = [
    { label: 'Wedding Functions', desc: 'Decor, stage & dining' },
    { label: 'Engagement Ceremony', desc: 'Intimate family gathering' },
    { label: 'Birthday Celebration', desc: 'Theme party & decor' },
    { label: 'Corporate Event', desc: 'Executive layout & dinner' },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 bg-ivory-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-maroon-900 text-xs font-semibold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5 text-gold-700" />
            <span>Connect &amp; Visit</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950 tracking-tight leading-tight mb-4">
            Planning an Event? Let&apos;s Make It Special.
          </h2>

          <p className="text-charcoal-800 text-base sm:text-lg font-normal leading-relaxed">
            Reach out directly on WhatsApp to check availability, ask questions, or receive personalized celebration packages.
          </p>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#650A25] to-transparent mx-auto mt-6" />
        </div>

        {/* 2-Column Layout: Details + WhatsApp Direct Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-gold-200 shadow-luxury space-y-6">
              <h3 className="font-serif text-2xl font-bold text-maroon-950 pb-4 border-b border-charcoal-200">
                {venueName}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-maroon-800 shrink-0">
                  <MapPin className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
                    Venue Address
                  </span>
                  <p className="text-sm text-charcoal-900 font-medium leading-relaxed mt-0.5">
                    {fullAddress}
                  </p>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-maroon-800 shrink-0">
                  <Phone className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
                    Phone / Reservations
                  </span>
                  {phoneNumber ? (
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-sm font-bold text-maroon-900 hover:text-gold-700 transition"
                    >
                      {phoneNumber}
                    </a>
                  ) : (
                    <span className="text-xs text-charcoal-700 font-medium italic">
                      Contact number pending configuration
                    </span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-maroon-800 shrink-0">
                  <Mail className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
                    Email Address
                  </span>
                  {emailAddress ? (
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-sm font-bold text-maroon-900 hover:text-gold-700 transition"
                    >
                      {emailAddress}
                    </a>
                  ) : (
                    <span className="text-xs text-charcoal-700 font-medium italic">
                      Official email pending configuration
                    </span>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-maroon-800 shrink-0">
                  <Clock className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
                    Visiting &amp; Booking Hours
                  </span>
                  <p className="text-sm text-charcoal-900 font-medium leading-relaxed mt-0.5">
                    {openingHours}
                  </p>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-charcoal-200 flex items-center gap-4">
                <span className="text-xs font-bold text-charcoal-700">Connect:</span>
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-ivory-100 hover:bg-blue-50 text-charcoal-700 hover:text-blue-600 transition border border-charcoal-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-ivory-100 hover:bg-pink-50 text-charcoal-700 hover:text-pink-600 transition border border-charcoal-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct WhatsApp Quotation Desk Card */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-maroon-950 text-white rounded-3xl p-8 sm:p-10 border border-gold-400/40 shadow-2xl h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold uppercase tracking-wider mb-4">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Quotation Channel</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
                  Direct Quotations on WhatsApp
                </h3>

                <p className="text-xs sm:text-sm text-ivory-100 leading-relaxed font-normal mb-8">
                  No complex forms needed! Click below to open an instant conversation with our reservations team on WhatsApp. Receive venue photos, decoration packages, and custom quotations directly on your phone.
                </p>

                {/* Instant Topic Buttons */}
                <div className="mb-8">
                  <span className="text-xs uppercase tracking-wider text-gold-300 font-bold block mb-3">
                    Choose Your Event Type for Pre-filled Quotation:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickEnquiryPresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() =>
                          handleWhatsAppClick(
                            `Hello Hriday Banquet Hall, I would like to get a quotation for a ${preset.label}. Please share package options and date availability.`
                          )
                        }
                        className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-gold-400/60 transition text-left group flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                            {preset.label}
                          </p>
                          <p className="text-[11px] sm:text-xs text-ivory-200">{preset.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gold-300 opacity-85 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-ivory-100 font-normal mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>Instant pricing &amp; availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>High-res hall &amp; stage videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>Custom decor &amp; catering menus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                    <span>Direct venue manager support</span>
                  </div>
                </div>
              </div>

              {/* Main Primary WhatsApp Action Button */}
              <div>
                {hasWhatsApp && waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick('contact', { custom_message: 'Main Contact Section CTA' })}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-8 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-base whitespace-nowrap rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2.5 sm:gap-3 border border-emerald-200/40"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0" />
                    <span>Get Instant Quotation on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleWhatsAppClick()}
                    className="w-full py-3.5 sm:py-4 px-5 sm:px-8 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-base whitespace-nowrap rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2.5 sm:gap-3 border border-emerald-200/40"
                  >
                    <MessageCircle className="w-6 h-6 fill-current" />
                    <span>Get Instant Quotation on WhatsApp</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Google Maps Location */}
        {mapsEmbedUrl && (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gold-200 shadow-luxury">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-charcoal-100 gap-3">
              <div>
                <h4 className="font-serif text-xl font-bold text-maroon-950 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold-600" />
                  <span>Interactive Venue Location</span>
                </h4>
                <p className="text-xs sm:text-sm text-charcoal-700 font-medium">
                  {fullAddress}
                </p>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-charcoal-950 text-xs font-semibold rounded-full transition shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>

            <div className="w-full aspect-[21/9] min-h-[300px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-charcoal-200">
              <iframe
                title="Hriday Banquet Hall Google Maps Location"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
