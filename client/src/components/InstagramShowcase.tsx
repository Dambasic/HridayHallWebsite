import React, { useState, useMemo } from 'react';
import {
  Instagram,
  ExternalLink,
  Eye,
  Heart,
  Star,
  Play,
  Sparkles,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Lightbox } from './Lightbox';
import { CelebrationItem, GalleryImage } from '../types';
import { resolveInstagramUrl } from '../utils/socialLinks';

export const InstagramShowcase: React.FC = () => {
  const { content, celebrations } = useContent();
  const [selectedCelebration, setSelectedCelebration] = useState<CelebrationItem | null>(null);

  const igData = content?.social?.find((s) => s.platform === 'instagram');
  const igHandle = igData?.handle || '@hridaybanquetspineroad';

  const displayCelebrations = celebrations && celebrations.length > 0 ? celebrations : [];

  const fallbackProfileUrl = resolveInstagramUrl(content);

  const getReviewInstagramUrl = (post: CelebrationItem): string | null => {
    return resolveInstagramUrl(content, post.instagram_url);
  };

  const lightboxImages: GalleryImage[] = useMemo(() => {
    return displayCelebrations.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      image_url: c.image_url,
      category: c.tag || 'Customer Review',
      display_order: c.featured_order,
      is_featured: c.is_featured,
      is_active: 1,
      created_at: c.created_at || '',
      updated_at: c.updated_at || '',
      // Customer Reviews must link to Instagram only, never redirect to a product/service page
      instagram_url: resolveInstagramUrl(content, c.instagram_url) || undefined,
    }));
  }, [displayCelebrations, content]);

  return (
    <section
      id="reviews"
      className="py-24 bg-white relative overflow-hidden border-t-2 border-b-2 border-gold-200/70"
    >
      {/* Subtle Decorative Gold Flares */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#650A25]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/70 text-gold-100 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Guest Experiences &amp; Video Reels</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight leading-tight mb-3">
              Our Customers Review
            </h2>

            <p className="text-charcoal-800 text-base sm:text-lg font-normal leading-relaxed">
              Hear directly from couples, families, and organizers who celebrated their happiest moments with us. Real reviews, authentic memories, and video reels.
            </p>
          </div>

          {fallbackProfileUrl && (
            <div className="flex items-center gap-3">
              <a
                href={fallbackProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#650A25] via-[#9D174D] to-[#6B21A8] hover:from-[#390014] hover:to-[#581C87] text-white text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-xl hover:scale-105 border border-gold-400/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <Instagram className="w-4 h-4 text-pink-200" />
                <span>Follow {igHandle}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-95" />
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Reviews & Video Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCelebrations.map((post) => {
            const reviewIgUrl = getReviewInstagramUrl(post);

            return (
              <article
                key={post.id}
                onClick={() => setSelectedCelebration(post)}
                className="group cursor-pointer bg-[#FFF9F0] rounded-3xl overflow-hidden border-2 border-gold-300/80 shadow-luxury hover:shadow-2xl hover:border-gold-500 transition-all duration-300 flex flex-col transform hover:-translate-y-1.5 relative"
              >
                {/* Media Reel Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-950">
                  {/* Clickable Image / Play Trigger opens Popup Lightbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCelebration(post);
                    }}
                    className="w-full h-full block cursor-pointer relative focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-400"
                    aria-label={`Open review popup for ${post.title}`}
                  >
                    <img
                      src={post.image_url}
                      alt={`${post.title} Customer Review at Hriday Banquet Hall`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Stronger Dark Scrim Overlays so Badges & 5-Star Rating Read Clearly */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#120B0F]/95 via-[#180007]/30 to-black/35 pointer-events-none" />

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-[#650A25] backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-gold-400 group-hover:scale-110 group-hover:bg-[#650A25] group-hover:text-white transition-all duration-300">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Star Rating Overlay */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white font-bold px-2 pointer-events-none">
                      <span
                        className="flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gold-400/40"
                        aria-label="5 out of 5 stars"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      </span>
                      <span className="text-[11px] sm:text-xs text-gold-100 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gold-400/40">
                        5.0 Guest Review
                      </span>
                    </div>
                  </button>

                  {/* Top Bar Badges (Sibling Layer so Instagram Reel Pill is Directly Clickable!) */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="px-3.5 py-1 bg-[#390014]/95 backdrop-blur-md border border-gold-400/70 text-gold-200 text-xs font-bold tracking-wider rounded-full flex items-center gap-1.5 shadow-md">
                      <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40" />
                      <span>{post.tag || '#HridayReview'}</span>
                    </span>

                    {reviewIgUrl && (
                      <a
                        href={reviewIgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${post.title} Reel on Instagram`}
                        title="Open this celebration on Instagram"
                        className="pointer-events-auto px-3 py-1 bg-[#390014]/95 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] backdrop-blur-md text-white text-xs font-bold rounded-full border border-gold-400/70 flex items-center gap-1.5 shadow-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-300" />
                        <span>Reel</span>
                        <ExternalLink className="w-3 h-3 opacity-90" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Review Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white border-t border-gold-200/80">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#390014] mb-2 group-hover:text-[#650A25] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <div className="relative pl-3 border-l-2 border-gold-500 my-3">
                      <p className="text-sm text-charcoal-900 font-normal italic leading-relaxed line-clamp-3">
                        &ldquo;{post.description}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Action Row */}
                  <div className="mt-4 pt-3 border-t border-gold-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCelebration(post);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-ivory-100 hover:bg-gold-100 text-[#390014] border border-gold-300 text-xs font-bold whitespace-nowrap transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#650A25]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#650A25] shrink-0" />
                      <span>View Review</span>
                    </button>

                    {reviewIgUrl ? (
                      <a
                        href={reviewIgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Open ${post.title} on Instagram`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#650A25] hover:bg-[#390014] text-white text-xs font-bold whitespace-nowrap transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                      >
                        <Instagram className="w-3.5 h-3.5 text-pink-200 shrink-0" />
                        <span>View on Instagram</span>
                        <ExternalLink className="w-3 h-3 opacity-90 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-[#650A25] uppercase tracking-wider">
                        Verified Guest
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Photo / Reel Preview (with View on Instagram + Clickable Photo) */}
      {selectedCelebration && (
        <Lightbox
          images={lightboxImages}
          initialImageId={selectedCelebration.id}
          onClose={() => setSelectedCelebration(null)}
        />
      )}
    </section>
  );
};
