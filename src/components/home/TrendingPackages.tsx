import React from 'react';
import { Gift, Check, Clock, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { BeautyPackage } from '../../types';
import { useWishlist } from '../../context/WishlistContext';

interface TrendingPackagesProps {
  packages: BeautyPackage[];
  onBookPackage: (pkg: BeautyPackage) => void;
  onOpenCustomBuilder: () => void;
}

export const TrendingPackages: React.FC<TrendingPackagesProps> = ({
  packages,
  onBookPackage,
  onOpenCustomBuilder,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
              <Gift className="w-3.5 h-3.5 text-[#8B4B4B]" />
              <span>Curated Value Bundles</span>
            </div>
            <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
              Personalized Occasion Packages
            </h2>
            <p className="text-sm text-[#5C5C5C] mt-1 max-w-xl">
              Complete head-to-toe beauty packages designed for weddings, pre-bridal glow, festivities, and weekend pampering.
            </p>
          </div>
          <button
            onClick={onOpenCustomBuilder}
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#4A0E0E] hover:bg-[#380A0A] px-5 py-2.5 rounded-full shadow-md shadow-[#4A0E0E]/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Custom Package Builder</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(packages || []).slice(0, 3).map((pkg, idx) => {
            const saved = isWishlisted(pkg.id);
            const finalPrice = pkg.packagePrice ?? pkg.discountedPrice ?? pkg.originalPrice;
            const originalPrice = pkg.originalPrice || finalPrice;
            const discountPercent = pkg.discountPercentage ?? pkg.discountPercent ?? Math.round(((originalPrice - finalPrice) / (originalPrice || 1)) * 100);
            const duration = pkg.estimatedDurationMinutes ?? pkg.durationMinutes ?? 120;
            const servicesList: string[] = pkg.services
              ? pkg.services.map(s => typeof s === 'string' ? s : s.name)
              : (pkg.servicesIncluded || pkg.includedServices || []);
            const isFeatured = idx === 0;

            return (
              <div
                key={pkg.id}
                className={`bg-[#FAF7F2] rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between relative shadow-xs hover:shadow-lg ${
                  isFeatured ? 'border-[#4A0E0E] ring-2 ring-[#4A0E0E]/20' : 'border-[#EAE2D8]'
                }`}
              >
                {isFeatured && (
                  <div className="bg-[#4A0E0E] text-white text-center py-1.5 text-[10px] font-bold uppercase tracking-widest">
                    ★ Most Popular Choice
                  </div>
                )}

                <div className="relative aspect-[16/9] overflow-hidden bg-[#EAE2D8]/40">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] border border-[#EAE2D8]">
                    {pkg.occasion}
                  </div>
                  {discountPercent > 0 && (
                    <div className="absolute top-3 right-3 bg-[#4A0E0E] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      Save {discountPercent}%
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C]">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#888888]" />
                        <span>{duration} mins total duration</span>
                      </span>
                      <span className="font-semibold text-[#8B4B4B]">{pkg.rating || 4.9}★ Rated</span>
                    </div>

                    <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Services Included Checklist */}
                    {servicesList.length > 0 && (
                      <div className="bg-white rounded-2xl p-3.5 border border-[#EAE2D8] space-y-1.5">
                        <p className="text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider">
                          Included Services ({servicesList.length}):
                        </p>
                        {servicesList.map((s, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs text-[#1A1A1A]">
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Booking */}
                  <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-serif-luxury font-bold text-[#1A1A1A]">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                        {originalPrice > finalPrice && (
                          <span className="text-xs text-[#888888] line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {originalPrice > finalPrice && (
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          You save ₹{(originalPrice - finalPrice).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onBookPackage(pkg)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#4A0E0E] hover:bg-[#380A0A] rounded-full transition-colors cursor-pointer shadow-xs"
                    >
                      Book Package
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
