import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FacilitiesServices } from '../components/FacilitiesServices';
import { GallerySlider } from '../components/GallerySlider';
import { InstagramShowcase } from '../components/InstagramShowcase';
import { SunshineEventsPromo } from '../components/SunshineEventsPromo';
import { ContactSection } from '../components/ContactSection';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { Footer } from '../components/Footer';
import { WhatsAppModal } from '../components/WhatsAppModal';
import { useContent } from '../context/ContentContext';
import { SEOHead } from '../components/SEOHead';
import { getHomepageSchema } from '../utils/seoSchema';

export const HomePage: React.FC = () => {
  const { content, isLoading } = useContent();
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const visibility = content?.settings?.section_visibility || {
    hero: true,
    about: true,
    services: true,
    gallery: true,
    instagram: true,
    sunshine: true,
    contact: true,
  };

  const contactPhone = content?.contact?.phone_number || '';

  if (isLoading && !content) {
    return (
      <div className="min-h-screen bg-ivory-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-gold-300 border-t-maroon-800 animate-spin" />
          <h2 className="font-serif text-2xl font-bold text-maroon-950">
            Hriday Banquet Hall
          </h2>
          <p className="text-xs uppercase tracking-widest text-gold-700 font-medium">
            Loading Premium Venue Experience...
          </p>
        </div>
      </div>
    );
  }

  const seoTitle = content?.settings?.seo_title || 'Hriday Banquet Hall – Luxury Weddings & Celebrations Venue in Kolkata';
  const seoDescription =
    content?.settings?.seo_description ||
    'Celebrate your special moments at Hriday Banquet Hall. An elegant destination for weddings, receptions, engagements, corporate events, and milestone parties in Kolkata.';
  const schema = getHomepageSchema(content);

  return (
    <div className="min-h-screen bg-ivory text-charcoal-900 selection:bg-gold-200 selection:text-maroon-950">
      {/* SEO Metadata & Schema.org JSON-LD */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords="Hriday Banquet Hall, banquet hall in Kolkata, luxury wedding venue Kolkata, marriage reception hall, AC banquet hall near me, birthday party hall, corporate event venue Kolkata"
        canonicalUrl="https://hridaybanquethall.com/"
        ogType="website"
        schema={schema}
      />

      {/* Navigation */}
      <Navbar onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />

      <main>
        {/* 1. Landing Page Hero Section with Floating Featured Celebrations Showcase */}
        {visibility.hero !== false && (
          <HeroSection onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        )}

        {/* 2. Curated Services for Every Celebration */}
        {visibility.services !== false && (
          <FacilitiesServices onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        )}

        {/* 3. Our Customers Review & Video Reels */}
        {visibility.instagram !== false && <InstagramShowcase />}

        {/* 4. Banquet Gallery Slider */}
        {visibility.gallery !== false && (
          <GallerySlider onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        )}

        {/* 5. Promotional Section - Sunshine Events & Management */}
        {visibility.sunshine !== false && (
          <SunshineEventsPromo onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        )}

        {/* 6. Contact Section */}
        {visibility.contact !== false && (
          <ContactSection onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp onOpenWhatsAppModal={() => setWhatsAppModalOpen(true)} />

      {/* WhatsApp Configuration Notification Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        brandName="Hriday Banquet Hall"
        phoneNumber={contactPhone}
      />
    </div>
  );
};
