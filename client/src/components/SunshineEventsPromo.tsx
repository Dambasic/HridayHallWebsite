import React from 'react';
import {
  TrendingUp,
  Instagram,
  Sparkles,
  Globe,
  Megaphone,
  Calendar,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Mail,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface SunshineEventsPromoProps {
  onOpenWhatsAppModal: () => void;
}

export const SunshineEventsPromo: React.FC<SunshineEventsPromoProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getSunshineWhatsAppUrl, getSunshineWhatsAppNumber } = useContent();
  const sunshine = content?.sunshine;

  // If section visibility is disabled by admin, return null
  if (!sunshine || sunshine.is_visible === 0) {
    return null;
  }

  const agencyName = sunshine.agency_name || 'SUNSHINE EVENTS & MANAGEMENT';
  const heading =
    sunshine.heading || 'Take Your Brand to the Next Level with Sunshine Events & Management';
  const supportingText =
    sunshine.supporting_text ||
    'From building your digital presence to creating impactful marketing campaigns, Sunshine Events & Management helps businesses grow with creative strategies and professional digital solutions.';
  const attribution =
    sunshine.attribution_statement ||
    'Website Marketing & Promotion of Hriday Banquet Hall is managed by Sunshine Events & Management.';
  const badgeText = sunshine.badge_text || 'Digital Partner & Agency Showcase';
  const calloutBadgeText = sunshine.callout_badge_text || 'Official Marketing Partner';
  const calloutSubtext =
    sunshine.callout_subtext ||
    'Grow your local brand presence, boost customer bookings, and launch high-impact digital campaigns with our expert team.';
  const agencyEmail =
    sunshine.email_address !== undefined
      ? sunshine.email_address
      : content?.contact?.email_address || 'sunshineexplores2016@gmail.com';
  const ctaButtonText = sunshine.cta_button_text || 'Enquire About Digital Marketing';

  const services = sunshine.services && sunshine.services.length > 0
    ? sunshine.services
    : [
        { id: 'ss_1', title: 'Digital Marketing', description: 'Data-driven online campaigns to expand customer reach and drive event enquiries.', icon_name: 'TrendingUp' },
        { id: 'ss_2', title: 'Social Media Management', description: 'Curated Instagram & Facebook content creation, reels production, and engagement growth.', icon_name: 'Instagram' },
        { id: 'ss_3', title: 'Business Branding', description: 'Cohesive brand identity, logo design, visual style guides, and brand positioning.', icon_name: 'Sparkles' },
        { id: 'ss_4', title: 'Website Development', description: 'High-converting, responsive websites tailored for hospitality and service brands.', icon_name: 'Globe' },
        { id: 'ss_5', title: 'Online Advertising', description: 'Targeted Google and Meta ad campaigns designed for maximum return on investment.', icon_name: 'Megaphone' },
        { id: 'ss_6', title: 'Event Management', description: 'End-to-end planning, vendor coordination, and on-ground management for premium events.', icon_name: 'Calendar' },
      ];

  const hasWhatsApp = Boolean(getSunshineWhatsAppNumber());
  const waUrl = getSunshineWhatsAppUrl();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!hasWhatsApp || !waUrl) {
      e.preventDefault();
      onOpenWhatsAppModal();
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-amber-400" />;
      case 'Instagram': return <Instagram className="w-6 h-6 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Globe': return <Globe className="w-6 h-6 text-amber-400" />;
      case 'Megaphone': return <Megaphone className="w-6 h-6 text-amber-400" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-amber-400" />;
      default: return <Briefcase className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="sunshine" className="py-24 sm:py-32 bg-gradient-to-b from-charcoal-950 via-[#121017] to-charcoal-950 text-white relative overflow-hidden">
      {/* Background Decorative Lighting Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Promotional Agency Badge & Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{badgeText}</span>
          </div>

          <h3 className="text-sm font-semibold tracking-widest uppercase text-amber-400 mb-2">
            {agencyName}
          </h3>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ivory-50 tracking-tight leading-tight mb-6">
            {heading}
          </h2>

          <p className="text-ivory-100 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            {supportingText}
          </p>
        </div>

        {/* Agency Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((srv: any, idx: number) => (
            <div
              key={srv.id || idx}
              className="bg-charcoal-900/80 backdrop-blur-md rounded-3xl p-7 border border-white/15 hover:border-amber-400/60 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all">
                {getServiceIcon(srv.icon_name)}
              </div>

              <h4 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {srv.title}
              </h4>

              <p className="text-xs sm:text-sm text-ivory-100/90 font-normal leading-relaxed">
                {srv.description}
              </p>
            </div>
          ))}
        </div>

        {/* Agency Promotional Callout Bar */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{calloutBadgeText}</span>
            </div>

            <p className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              {attribution}
            </p>

            <p className="text-xs sm:text-sm text-ivory-200 font-normal">
              {calloutSubtext}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {agencyEmail && (
              <a
                href={`mailto:${agencyEmail}`}
                className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 text-ivory-50 font-semibold text-xs sm:text-sm rounded-full transition shadow flex items-center justify-center gap-2 border border-amber-400/40"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>{agencyEmail}</span>
              </a>
            )}
            {hasWhatsApp && waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-xs sm:text-sm whitespace-nowrap rounded-full transition shadow-lg flex items-center justify-center gap-2 border border-emerald-400/30"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{ctaButtonText}</span>
              </a>
            ) : (
              <button
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto px-5 sm:px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-charcoal-950 font-semibold text-xs sm:text-sm whitespace-nowrap rounded-full transition shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-charcoal-950 shrink-0" />
                <span>{ctaButtonText}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
