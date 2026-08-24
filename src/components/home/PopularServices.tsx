import React from 'react';
import { Clock, Star, Sparkles, Heart, ArrowRight, Check } from 'lucide-react';
import { Service } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface PopularServicesProps {
  services: Service[];
  onBookService: (service: Service) => void;
  onSelectService: (service: Service) => void;
  onViewAllServices: () => void;
}

export const PopularServices: React.FC<PopularServicesProps> = ({
  services,
  onBookService,
  onSelectService,
  onViewAllServices,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <section className="py-16 bg-white border-b border-[#EAE2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B4B4B]" />
              <span>Trending Treatments</span>
            </div>
            <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
              Most Requested Beauty Services
            </h2>
            <p className="text-sm text-[#5C5C5C] mt-1 max-w-xl">
              From Hydra Glow facials to precision haircuts and regal bridal artistry, experience five-star treatments.
            </p>
          </div>
          <button
            onClick={onViewAllServices}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4A0E0E] bg-[#FAF7F2] border border-[#EAE2D8] px-5 py-2.5 rounded-full shadow-xs hover:bg-[#F2E8E8] transition cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 8).map((service) => {
            const saved = isWishlisted(service.id);
            const discountPercent = service.originalPrice
              ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
              : 0;

            return (
              <div
                key={service.id}
                className="group bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EAE2D8] hover:border-[#4A0E0E] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE2D8]/40">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A1A1A]/90 text-white backdrop-blur-xs">
                      {service.category}
                    </span>
                    {discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#4A0E0E] text-white">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(service.id, 'service');
                    }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#5C5C5C] hover:text-[#4A0E0E] transition shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${saved ? 'text-[#4A0E0E] fill-[#F2E8E8]' : ''}`} />
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                    <span className="bg-[#1A1A1A]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center space-x-1 text-[#FAF7F2]">
                      <Clock className="w-3 h-3 text-[#F2E8E8]" />
                      <span>{service.durationMinutes} mins</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <RatingStars rating={service.rating} reviewCount={service.reviewCount} size="sm" />
                    <h3
                      onClick={() => onSelectService(service)}
                      className="text-sm font-serif-luxury font-bold text-[#1A1A1A] group-hover:text-[#4A0E0E] transition cursor-pointer leading-snug line-clamp-2"
                    >
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Price & Book */}
                  <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-bold text-[#1A1A1A] font-serif-luxury">
                          ₹{service.price.toLocaleString()}
                        </span>
                        {service.originalPrice && (
                          <span className="text-xs text-[#888888] line-through">
                            ₹{service.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onBookService(service)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4A0E0E] hover:bg-[#380A0A] rounded-full transition cursor-pointer shadow-xs"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
