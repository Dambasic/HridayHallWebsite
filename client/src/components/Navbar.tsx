import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { trackWhatsAppClick } from '../services/analytics';
import { resolveInstagramUrl } from '../utils/socialLinks';

interface NavbarProps {
  onOpenWhatsAppModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWhatsAppModal }) => {
  const { content, getHridayWhatsAppUrl, getHridayWhatsAppNumber } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasWhatsApp = Boolean(getHridayWhatsAppNumber());
  const waUrl = getHridayWhatsAppUrl();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    trackWhatsAppClick('navbar', { placement_label: 'Sticky Navbar' });
    if (!hasWhatsApp || !waUrl) {
      e.preventDefault();
      onOpenWhatsAppModal();
    }
  };

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'Home', href: isHomePage ? '#home' : '/#home' },
    { label: 'Facilities', href: isHomePage ? '#facilities' : '/#facilities' },
    { label: 'Reviews', href: isHomePage ? '#reviews' : '/#reviews' },
    { label: 'Gallery', href: isHomePage ? '#gallery' : '/#gallery' },
    { label: 'Sunshine Events', href: isHomePage ? '#sunshine' : '/#sunshine' },
    { label: 'Contact Us', href: isHomePage ? '#contact' : '/#contact' },
  ];

  const igLink = resolveInstagramUrl(content) || 'https://instagram.com';
  const fbLink = content?.social?.find((s) => s.platform === 'facebook')?.url || 'https://facebook.com';

  // Use royal wine-burgundy styling for consistent high-contrast text visibility
  const isSolidNavbar = !isHomePage || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isSolidNavbar
          ? 'bg-gradient-to-r from-[#26000D] via-[#390014] to-[#26000D] text-white shadow-xl border-b border-gold-400/40 py-2.5'
          : 'bg-gradient-to-b from-[#180007]/95 via-[#180007]/80 to-[#180007]/35 backdrop-blur-sm py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gold-400 shadow-gold-sm flex-shrink-0 bg-[#390014] transition-transform group-hover:scale-105">
              <img
                src="/hriday-logo.png"
                alt="Hriday Banquet Hall Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white drop-shadow-sm">
                HRIDAY
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-300">
                Banquet Hall
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - High Contrast & Crisp */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-ivory-100 hover:text-gold-300 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-400 after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Social Icons */}
            <div className="flex items-center gap-1.5 mr-1">
              <a
                href={fbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gold-200 bg-white/10 hover:text-white hover:bg-[#650A25] border border-gold-400/30 transition-colors"
                title="Official Facebook Page"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-gold-200 bg-white/10 hover:text-white hover:bg-[#650A25] border border-gold-400/30 transition-colors"
                title="Official Instagram Account"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Prominent WhatsApp Quotation Button */}
            {hasWhatsApp && waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('navbar', { placement_label: 'Sticky Navbar Desktop' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg border border-emerald-200/30"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Get a Quotation</span>
              </a>
            ) : (
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg border border-emerald-200/30 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Get a Quotation</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={handleWhatsAppClick}
              className="p-2 rounded-full text-white bg-[#25D366] hover:bg-[#20ba5a] transition shadow"
              aria-label="WhatsApp Quotation"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 px-4 bg-[#26000D]/98 backdrop-blur-xl border border-gold-400/50 rounded-2xl shadow-2xl text-white animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-sm font-semibold text-ivory-100 hover:bg-[#4A071D] hover:text-gold-300 transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-gold-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-around py-1">
                <a
                  href={fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-white"
                >
                  <Facebook className="w-4 h-4 text-blue-400" /> Facebook
                </a>
                <a
                  href={igLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-white"
                >
                  <Instagram className="w-4 h-4 text-pink-400" /> Instagram
                </a>
              </div>

              {hasWhatsApp && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('navbar', { placement_label: 'Sticky Navbar Mobile Drawer' })}
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Get a Quotation on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    trackWhatsAppClick('navbar', { placement_label: 'Sticky Navbar Mobile Drawer' });
                    setMobileMenuOpen(false);
                    onOpenWhatsAppModal();
                  }}
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Get a Quotation on WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
