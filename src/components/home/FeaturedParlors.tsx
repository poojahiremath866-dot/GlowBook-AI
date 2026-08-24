import React from 'react';
import { MapPin, Star, Heart, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Parlor } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface FeaturedParlorsProps {
  parlors: Parlor[];
  onSelectParlor: (parlor: Parlor) => void;
  onBookParlor: (parlor: Parlor) => void;
  onViewAll: () => void;
}

export const FeaturedParlors: React.FC<FeaturedParlorsProps> = ({
  parlors = [],
  onSelectParlor,
  onBookParlor,
  onViewAll,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
              <Star className="w-3.5 h-3.5 fill-[#8B4B4B] text-[#8B4B4B]" />
              <span>Verified Top Salons</span>
            </div>
            <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
              Featured Luxury Parlors & Studios
            </h2>
            <p className="text-sm text-[#5C5C5C] mt-1 max-w-xl">
              Handpicked salons recognized for elite hygiene, certified master stylists, and unforgettable beauty transformations.
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4A0E0E] bg-white border border-[#EAE2D8] px-5 py-2.5 rounded-full shadow-xs hover:bg-[#FAF7F2] transition cursor-pointer"
          >
            <span>Explore All Parlors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(parlors || []).slice(0, 6).map((parlor) => {
            const saved = isWishlisted(parlor.id);

            return (
              <div
                key={parlor.id}
                className="group bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EAE2D8] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D8]/40">
                  <img
                    src={parlor.coverImage}
                    alt={parlor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#1A1A1A] backdrop-blur shadow-xs flex items-center space-x-1 border border-[#EAE2D8]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Verified</span>
                    </span>
                    <Badge variant="rose" size="sm">{parlor.type}</Badge>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(parlor.id, 'parlor');
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#5C5C5C] hover:text-[#4A0E0E] hover:bg-white transition shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'text-[#4A0E0E] fill-[#F2E8E8]' : ''}`} />
                  </button>

                  {/* Bottom Image Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center space-x-1 font-medium bg-[#1A1A1A]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs text-[#FAF7F2]">
                      <MapPin className="w-3.5 h-3.5 text-[#F2E8E8]" />
                      <span>{parlor.city} • {parlor.distanceKm} km</span>
                    </span>
                    {parlor.availableToday && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/90 font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs text-white">
                        Open Today
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <RatingStars rating={parlor.rating} reviewCount={parlor.reviewCount} size="sm" />
                      <span className="text-xs text-[#5C5C5C] flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#888888]" />
                        <span>{parlor.openingHours.split('-')[0]}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectParlor(parlor)}
                      className="text-lg font-serif-luxury font-bold text-[#1A1A1A] group-hover:text-[#4A0E0E] transition cursor-pointer leading-tight"
                    >
                      {parlor.name}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] line-clamp-2 leading-relaxed">
                      {parlor.description}
                    </p>

                    {/* Amenities tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parlor.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border border-[#EAE2D8] text-[#5C5C5C]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action CTA */}
                  <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#888888] uppercase font-bold tracking-wider">Starting from</span>
                      <p className="text-base font-bold text-[#1A1A1A] font-serif-luxury">
                        ₹{parlor.startingPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectParlor(parlor)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A] hover:text-[#4A0E0E] bg-white border border-[#EAE2D8] hover:bg-[#FAF7F2] rounded-full transition cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onBookParlor(parlor)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4A0E0E] hover:bg-[#380A0A] rounded-full shadow-sm shadow-[#4A0E0E]/20 transition cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
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
