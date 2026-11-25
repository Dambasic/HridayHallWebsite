import React from 'react';
import { Crown, Sparkles, HeartHandshake, CheckCircle2, Award, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface AboutSectionProps {
  onOpenWhatsAppModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const about = content?.about;

  const heading = about?.heading || 'Where Every Celebration Becomes a Beautiful Memory';
  const description =
    about?.description ||
    'At Hriday Banquet Hall, we believe every special occasion deserves a beautiful setting. Whether it is a wedding celebration, engagement, birthday, anniversary, or corporate event, our venue provides a welcoming environment to make every gathering memorable.';

  const venueImage =
    about?.venue_image ||
    'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80';

  const card1Title = about?.highlight_card_1_title || 'Elegant Celebration Space';
  const card1Desc =
    about?.highlight_card_1_desc ||
    'A thoughtfully designed hall with warm ambient lighting, grand decor, and luxurious aesthetics tailored for your celebrations.';

  const card2Title = about?.highlight_card_2_title || 'Memorable Events';
  const card2Desc =
    about?.highlight_card_2_desc ||
    'From intimate family gatherings to grand wedding receptions, every event is hosted with grace and attention to detail.';

  const card3Title = about?.highlight_card_3_title || 'Dedicated Event Support';
  const card3Desc =
    about?.highlight_card_3_desc ||
    'Our supportive management team assists you every step of the way to ensure your event runs seamlessly.';

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl('Hello Hriday Banquet Hall, I am interested in checking venue availability and receiving package details for an event.');

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!hasWhatsApp || !waUrl) {
      e.preventDefault();
      onOpenWhatsAppModal();
    }
  };

  const highlightCards = [
    {
      title: card1Title,
      desc: card1Desc,
      icon: Crown,
      tag: 'Ambience',
    },
    {
      title: card2Title,
      desc: card2Desc,
      icon: Sparkles,
      tag: 'Experiences',
    },
    {
      title: card3Title,
      desc: card3Desc,
      icon: HeartHandshake,
      tag: 'Hospitality',
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-ivory-50 relative overflow-hidden">
      {/* Subtle background ornamentation */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-maroon-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-100 border border-gold-300 text-maroon-900 text-xs font-semibold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5 text-gold-700" />
            <span>About Hriday Banquet Hall</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-maroon-950 tracking-tight leading-tight mb-4">
            {heading}
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
        </div>

        {/* 2-Column Content: Image + Text Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left Column: Visual Presentation */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-300/60 p-2 bg-white group">
              <div className="rounded-2xl overflow-hidden relative aspect-[4/3] bg-charcoal-100">
                <img
                  src={venueImage}
                  alt="Hriday Banquet Hall Interior"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 backdrop-blur-md bg-charcoal-950/40 rounded-xl border border-white/20">
                  <p className="font-serif text-base font-semibold text-gold-200">
                    Warm Hospitality &amp; Grand Celebrations
                  </p>
                  <p className="text-xs text-ivory-200">
                    A welcoming destination for lifetime memories
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Gold Floating Badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-white border border-gold-300 p-4 rounded-2xl shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-maroon-900 flex items-center justify-center text-gold-300 shadow">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif font-bold text-maroon-950 text-sm">Finest Hospitality</p>
                <p className="text-xs text-charcoal-700 font-medium">Unmatched Celebratory Ambience</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-900 mb-6 leading-snug">
              Every detail planned with elegance, warmth, and dedication.
            </h3>

            <p className="text-charcoal-800 text-base sm:text-lg leading-relaxed mb-6">
              {description}
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <p className="text-sm text-charcoal-700">
                  <strong>Welcoming Atmosphere:</strong> Designed to host family, friends, and esteemed guests in utmost comfort.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <p className="text-sm text-charcoal-700">
                  <strong>Personalized Attention:</strong> Tailored coordination so you can enjoy your occasion stress-free.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                <p className="text-sm text-charcoal-700">
                  <strong>Transparent Communications:</strong> Request direct quotations and view verified photographs anytime on WhatsApp.
                </p>
              </div>
            </div>

            {/* WhatsApp Availability Button */}
            <div>
              {hasWhatsApp && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold tracking-wide transition shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Check Availability on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold tracking-wide transition shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Check Availability on WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Editable Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlightCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-gold-200/80 shadow-luxury hover:shadow-xl hover:border-gold-400 transition-all duration-300 relative group flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-300/80 flex items-center justify-center text-maroon-800 group-hover:scale-110 group-hover:from-[#650A25] group-hover:to-[#390014] group-hover:text-gold-200 transition-all duration-300 shadow-gold-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-gold-700 bg-gold-50 px-2.5 py-1 rounded-full border border-gold-200">
                    {card.tag}
                  </span>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-maroon-950 mb-3 group-hover:text-gold-700 transition-colors">
                  {card.title}
                </h4>

                <p className="text-sm text-charcoal-700 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
