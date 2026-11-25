import React, { useState } from 'react';
import { Sparkles, Eye, ArrowRight, Heart } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Lightbox } from './Lightbox';
import { CelebrationItem } from '../types';

export const FeaturedCelebrations: React.FC = () => {
  const { featuredCelebrations } = useContent();
  const [selectedCelebration, setSelectedCelebration] = useState<CelebrationItem | null>(null);

  // If no celebrations are marked as featured, hide section gracefully
  if (!featuredCelebrations || featuredCelebrations.length === 0) {
    return null;
  }

  return (
    <section id="featured-celebrations" className="py-20 sm:py-28 bg-[#FFF9F0] relative overflow-hidden border-b-2 border-gold-200/60">
      {/* Background Decorative Gold Flares */}
      <div className="absolute -top-32 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-96 h-96 bg-[#650A25]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <span>Curated Highlights</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight leading-tight mb-4">
            Featured Celebrations
          </h2>

          <p className="text-charcoal-800 text-base sm:text-lg font-medium leading-relaxed">
            Discover the Moments That Make Us Special — signature gatherings and unforgettable milestones hosted with regal grandeur.
          </p>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#650A25] to-transparent mx-auto mt-6" />
        </div>

        {/* Featured Cards Grid */}
        <div className={`grid grid-cols-1 ${featuredCelebrations.length === 1 ? 'max-w-xl mx-auto' : featuredCelebrations.length === 2 ? 'sm:grid-cols-2 max-w-4xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {featuredCelebrations.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedCelebration(item)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border-2 border-gold-300/80 shadow-luxury hover:shadow-2xl hover:border-gold-500 transition-all duration-500 flex flex-col transform hover:-translate-y-2 relative"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/11] overflow-hidden bg-charcoal-900">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#180007]/85 via-[#390014]/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />
                <div className="absolute inset-0 ring-1 ring-inset ring-gold-400/30 rounded-t-3xl pointer-events-none" />

                {/* Badge Tag */}
                {item.tag && (
                  <span className="absolute top-4 left-4 px-3.5 py-1 bg-[#390014]/90 backdrop-blur-md border border-gold-400/60 text-gold-300 text-xs font-bold tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
                    <span>{item.tag}</span>
                  </span>
                )}

                {/* Hover Preview Quick Action */}
                <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white/95 text-[#650A25] backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl border border-gold-300">
                  <Eye className="w-5 h-5 text-[#650A25]" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#390014] mb-3 group-hover:text-[#650A25] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-charcoal-800 font-normal leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold-200/70 flex items-center justify-between text-xs font-bold text-[#650A25] group-hover:text-[#390014] transition-colors">
                  <span className="uppercase tracking-wider">Explore Experience</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 text-gold-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Celebration Details */}
      {selectedCelebration && (
        <Lightbox
          images={featuredCelebrations.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            image_url: c.image_url,
            category: c.tag || 'Featured Celebration',
            display_order: c.featured_order,
            is_featured: 1,
            is_active: 1,
            created_at: '',
            updated_at: '',
          }))}
          initialImageId={selectedCelebration.id}
          onClose={() => setSelectedCelebration(null)}
        />
      )}
    </section>
  );
};
