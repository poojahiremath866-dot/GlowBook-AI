import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Tag,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BeautyPackage, AIRecommendation } from '../../types';
import { Badge } from '../common/Badge';

interface ExplorePackagesPageProps {
  packages: BeautyPackage[];
  onBookPackage: (pkg: BeautyPackage) => void;
  onOpenAiBuilder: () => void;
  onOpenConsultant: () => void;
}

export const ExplorePackagesPage: React.FC<ExplorePackagesPageProps> = ({
  packages,
  onBookPackage,
  onOpenAiBuilder,
  onOpenConsultant,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState('All');

  const occasions = ['All', 'Bridal', 'Party Glow', 'Pre-Wedding', 'Weekend Spa', 'Corporate Grooming'];

  const filteredPackages = selectedOccasion === 'All'
    ? packages
    : packages.filter(p => p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-[#4A0E0E] text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#380A0A]">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8]/20 text-[#F2E8E8] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#F2E8E8]/30">
              <Gift className="w-3.5 h-3.5" />
              <span>Curated Bridal & Festive Bundles</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-medium text-white leading-tight">
              Exclusive Beauty Bundles & Packages
            </h1>
            <p className="text-xs text-[#EAE2D8] leading-relaxed">
              Save up to 40% when bundling complimentary hair, makeup, facial, and spa services for weddings, parties, and festive occasions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenAiBuilder}
              className="px-6 py-3.5 bg-white hover:bg-[#FAF7F2] text-[#4A0E0E] text-xs uppercase tracking-wider font-semibold rounded-full shadow-lg flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8B4B4B]" />
              <span>Build Custom Package with AI</span>
            </button>
          </div>
        </div>

        {/* Occasion Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {occasions.map(occ => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap shadow-xs ${
                selectedOccasion === occ
                  ? 'bg-[#4A0E0E] text-white shadow-sm'
                  : 'bg-white text-[#5C5C5C] border border-[#EAE2D8] hover:bg-[#F2E8E8]'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredPackages || []).map(pkg => {
            const finalPrice = pkg.packagePrice ?? pkg.discountedPrice ?? pkg.originalPrice;
            const originalPrice = pkg.originalPrice || finalPrice;
            const discountPercent = pkg.discountPercentage ?? pkg.discountPercent ?? Math.round(((originalPrice - finalPrice) / (originalPrice || 1)) * 100);
            const duration = pkg.estimatedDurationMinutes ?? pkg.durationMinutes ?? 120;
            const servicesList: string[] = pkg.services
              ? pkg.services.map(s => typeof s === 'string' ? s : s.name)
              : (pkg.servicesIncluded || pkg.includedServices || []);

            return (
              <div
                key={pkg.id}
                className="group bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EAE2D8] hover:border-[#4A0E0E] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D8]/40">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#4A0E0E] shadow-xs backdrop-blur">
                      {pkg.occasion}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="absolute top-3 right-3 bg-emerald-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      Save {discountPercent}%
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center space-x-1 bg-[#1A1A1A]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs text-[#FAF7F2]">
                      <Clock className="w-3.5 h-3.5 text-[#F2E8E8]" />
                      <span>{duration} mins total</span>
                    </span>
                    <span className="font-bold text-amber-300">
                      {pkg.rating || 4.9}★ {pkg.reviewCount ? `(${pkg.reviewCount})` : ''}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif-luxury font-bold text-lg text-[#1A1A1A] leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed line-clamp-2">
                      {pkg.description}
                    </p>

                    {servicesList.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-[#EAE2D8]">
                        <span className="text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider">
                          Included Treatments:
                        </span>
                        <div className="space-y-1">
                          {servicesList.map((srv, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-xs text-[#1A1A1A]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{srv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#888888] uppercase font-bold tracking-wider">Bundle Price</span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-lg font-bold text-[#4A0E0E] font-serif-luxury">
                          ₹{finalPrice.toLocaleString()}
                        </span>
                        {originalPrice > finalPrice && (
                          <span className="text-xs text-[#888888] line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onBookPackage(pkg)}
                      className="px-5 py-2.5 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold rounded-full transition cursor-pointer shadow-xs flex items-center space-x-1.5"
                    >
                      <span>Book Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
