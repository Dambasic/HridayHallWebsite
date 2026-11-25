import React from 'react';
import { MessageSquare, PhoneCall, X, AlertCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  phoneNumber?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  brandName = 'Hriday Banquet Hall',
  phoneNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gold-300/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-gold-100 rounded-full blur-xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-700 hover:text-maroon-950 transition-colors rounded-full bg-ivory-100 hover:bg-ivory-200 border border-charcoal-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
          <MessageSquare className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-maroon-900 mb-2">
          WhatsApp Direct Quotation
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-medium mb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          WhatsApp Number Pending Configuration
        </div>

        <p className="text-sm text-charcoal-800 mb-6 leading-relaxed">
          The official WhatsApp quotation line for <strong className="text-maroon-800">{brandName}</strong> will become active as soon as the owner adds the phone number in the Admin Panel.
        </p>

        <div className="flex flex-col gap-3">
          {phoneNumber && (
            <a
              href={`tel:${phoneNumber}`}
              className="w-full py-3.5 px-5 bg-maroon-800 hover:bg-maroon-900 text-ivory-100 font-medium rounded-xl transition shadow-maroon-sm flex items-center justify-center gap-2 text-sm"
            >
              <PhoneCall className="w-4 h-4 text-gold-300" />
              Call Management Desk Directly
            </a>
          )}

          <Link
            to="/admin/whatsapp"
            onClick={onClose}
            className="w-full py-3 px-5 bg-gold-50 hover:bg-gold-100 border border-gold-300 text-maroon-900 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Settings className="w-3.5 h-3.5 text-gold-700" />
            <span>Configure WhatsApp in Admin</span>
          </Link>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 border border-charcoal-200 hover:bg-ivory-100 text-charcoal-700 text-xs font-medium rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
