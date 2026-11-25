import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

interface FacilitiesServicesProps {
  onOpenWhatsAppModal?: () => void;
}

export const FacilitiesServices: React.FC<FacilitiesServicesProps> = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const services = content?.services || [];

  const handleCardClick = (slug: string, id: string) => {
    navigate(`/services/${slug || id}`);
  };

  return (
    <section id="facilities" className="py-24 sm:py-32 bg-[#FFF9F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#650A25] border border-gold-400/60 text-gold-200 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <span>Facilities &amp; Services</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#390014] tracking-tight leading-tight mb-4">
            Curated Services for Every Celebration
          </h2>

          <p className="text-charcoal-800 text-base sm:text-lg font-medium leading-relaxed">
            From majestic wedding receptions to intimate family celebrations and executive conferences, explore our bespoke arrangements.
          </p>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#650A25] to-transparent mx-auto mt-6" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleCardClick(service.slug, service.id)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border-2 border-gold-200/90 shadow-luxury hover:shadow-2xl hover:border-gold-400 transition-all duration-300 flex flex-col transform hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-900">
                <img
                  src={service.image_url}
                  alt={`${service.title} Arrangement at Hriday Banquet Hall`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180007]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                <span className="absolute top-3 left-3 px-3 py-1 bg-[#390014]/90 backdrop-blur-md border border-gold-400/60 text-gold-300 text-[11px] font-bold uppercase tracking-wider rounded-full shadow">
                  {service.category || 'Celebration'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#390014] mb-2 group-hover:text-[#650A25] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-800 line-clamp-3 leading-relaxed font-normal mb-6">
                    {service.short_description || service.description}
                  </p>
                </div>

                {/* Explore Details CTA */}
                <div className="pt-4 border-t border-gold-200/80 flex items-center justify-between text-xs font-bold text-[#650A25] group-hover:text-[#390014] transition-colors">
                  <span className="uppercase tracking-wider">Explore Details</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
