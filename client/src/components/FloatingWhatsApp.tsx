import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';

interface FloatingWhatsAppProps {
  onOpenWhatsAppModal: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ onOpenWhatsAppModal }) => {
  const { getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl();

  const handleClick = (e: React.MouseEvent) => {
    trackWhatsAppClick('floating_button', { placement_label: 'Floating WhatsApp Widget' });
    if (!hasWhatsApp || !waUrl) {
      e.preventDefault();
      onOpenWhatsAppModal();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 pointer-events-none">
      {/* Main Floating Button */}
      <div className="group pointer-events-auto relative">
        <div className="hidden sm:block opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-[#26000D]/95 border border-gold-400/70 rounded-2xl px-3.5 py-2 shadow-xl text-ivory-50 text-xs whitespace-nowrap">
          <div className="font-bold text-gold-300">Hriday Banquet Helpdesk</div>
          <div className="text-[11px] text-ivory-100">Instant WhatsApp quotation</div>
        </div>

        {hasWhatsApp && waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick('floating_button', { placement_label: 'Floating WhatsApp Widget' })}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-emerald-200/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
            aria-label="Contact Hriday Banquet Hall on WhatsApp"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
          </a>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-emerald-200/70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
            aria-label="WhatsApp Quotation"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
