import React from 'react';
import { Instagram, Facebook, MessageCircle, Lock, MapPin, Phone, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Link, useLocation } from 'react-router-dom';
import { resolveInstagramUrl } from '../utils/socialLinks';

interface FooterProps {
  onOpenWhatsAppModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const location = useLocation();

  const igLink = resolveInstagramUrl(content) || 'https://instagram.com';
  const fbLink = content?.social?.find((s) => s.platform === 'facebook')?.url || 'https://facebook.com';
  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl();

  const sunshine = content?.sunshine;
  const agencyName = sunshine?.agency_name || 'Sunshine Events & Management';

  const isHomePage = location.pathname === '/';

  return (
    <footer className="bg-charcoal-950 text-ivory-200 border-t border-gold-400/20 pt-16 pb-24 sm:pb-24 relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-gold-sm flex-shrink-0 bg-burgundy-950">
                <img
                  src="/hriday-logo.png"
                  alt="Hriday Banquet Hall"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-wide text-ivory-50">
                  HRIDAY
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-gold-400">
                  Banquet Hall
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ivory-200 leading-relaxed font-normal">
              An elegant destination for weddings, celebrations, corporate gatherings, and unforgettable memories. Your celebrations, our commitment.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold tracking-wider uppercase text-gold-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-ivory-100">
              <li>
                <a href={isHomePage ? '#home' : '/#home'} className="hover:text-gold-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href={isHomePage ? '#facilities' : '/#facilities'} className="hover:text-gold-300 transition-colors">
                  Facilities &amp; Services
                </a>
              </li>
              <li>
                <a href={isHomePage ? '#reviews' : '/#reviews'} className="hover:text-gold-300 transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href={isHomePage ? '#gallery' : '/#gallery'} className="hover:text-gold-300 transition-colors">
                  Banquet Gallery
                </a>
              </li>
              <li>
                <a href={isHomePage ? '#sunshine' : '/#sunshine'} className="hover:text-gold-300 transition-colors">
                  Sunshine Events
                </a>
              </li>
              <li>
                <a href={isHomePage ? '#contact' : '/#contact'} className="hover:text-gold-300 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Venue Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold tracking-wider uppercase text-gold-300">
              Venue Location
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-ivory-100">
              {content?.contact?.full_address ? (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{content.contact.full_address}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="text-ivory-200">Address available upon request</span>
                </div>
              )}

              {content?.contact?.phone_number && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <a href={`tel:${content.contact.phone_number}`} className="hover:text-gold-300 transition">
                    {content.contact.phone_number}
                  </a>
                </div>
              )}

              {content?.contact?.email_address && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <a href={`mailto:${content.contact.email_address}`} className="hover:text-gold-300 transition">
                    {content.contact.email_address}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Column 4: Official Social Channels & WhatsApp */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold tracking-wider uppercase text-gold-300">
              Connect With Us
            </h4>
            <p className="text-xs sm:text-sm text-ivory-200 font-normal leading-relaxed">
              Follow our official social profiles to explore recent decor, customer celebrations, and banquet updates.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-900 border border-gold-400/30 hover:border-gold-400 text-ivory-100 hover:text-white flex items-center justify-center transition shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-900 border border-gold-400/30 hover:border-gold-400 text-ivory-100 hover:text-white flex items-center justify-center transition shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {hasWhatsApp && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center transition shadow hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              ) : (
                <button
                  onClick={onOpenWhatsAppModal}
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center transition shadow hover:scale-105 cursor-pointer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>

            {/* Admin Access Link */}
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs text-ivory-200 hover:text-gold-300 transition font-medium"
              >
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span>Admin Login Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory-200 sm:pr-16">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Hriday Banquet Hall. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2.5 text-center text-ivory-200 font-normal">
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5">
              <span>Website marketing by</span>
              <span className="font-semibold text-gold-300 hover:text-gold-200 transition cursor-default">
                {agencyName}
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
