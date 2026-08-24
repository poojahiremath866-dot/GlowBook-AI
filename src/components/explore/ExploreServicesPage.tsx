import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  Filter,
  CheckCircle2,
  Heart,
  Tag,
  Scissors
} from 'lucide-react';
import { Service, Parlor } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface ExploreServicesPageProps {
  services: Service[];
  parlors: Parlor[];
  onBookService: (service: Service) => void;
  onOpenConsultant: () => void;
}

export const ExploreServicesPage: React.FC<ExploreServicesPageProps> = ({
  services = [],
  parlors = [],
  onBookService,
  onOpenConsultant,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState(15000);

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'hair', label: '💇‍♀️ Hair & Scalp' },
    { id: 'skin', label: '✨ Skin & Facials' },
    { id: 'makeup', label: '💄 Bridal & Glam' },
    { id: 'nails', label: '💅 Nails & Gel' },
    { id: 'spa', label: '🌿 Body Spa & Detan' },
    { id: 'threading', label: '👁️ Brows & Threading' },
  ];

  const filteredServices = useMemo(() => {
    return (services || []).filter(s => {
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      const matchesQuery =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = s.price <= maxPrice;
      return matchesCategory && matchesQuery && matchesPrice;
    });
  }, [services, selectedCategory, searchQuery, maxPrice]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
              <Scissors className="w-3.5 h-3.5" />
              <span>Salon Services & Treatments Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
              Explore Beauty Services & Treatments
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Select verified luxury hair, bridal makeup, medical aesthetics, and organic spa treatments
            </p>
          </div>

          <button
            onClick={onOpenConsultant}
            className="px-6 py-3 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-md shadow-[#4A0E0E]/20 flex items-center space-x-2 transition cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Analyze My Skin & Hair</span>
          </button>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#4A0E0E] text-white shadow-sm'
                  : 'bg-white text-[#5C5C5C] border border-[#EAE2D8] hover:bg-[#F2E8E8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Price Filter Bar */}
        <div className="bg-[#FAF7F2] rounded-3xl p-4 border border-[#EAE2D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments, e.g. Hydra facial, balayage, keratin..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-[#EAE2D8] text-xs focus:ring-2 focus:ring-[#4A0E0E]/20"
            />
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-end text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[#8B4B4B] font-bold uppercase tracking-wider text-[10px]">Max Price:</span>
              <span className="text-[#4A0E0E] font-bold">₹{maxPrice}</span>
              <input
                type="range"
                min="300"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-28 accent-[#4A0E0E] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => {
            const saved = isWishlisted(service.id);
            return (
              <div
                key={service.id}
                className="group bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EAE2D8] hover:border-[#4A0E0E] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D8]/40">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                    {service.popular && <Badge variant="rose">Most Popular</Badge>}
                    <Badge variant="stone">{service.category.toUpperCase()}</Badge>
                  </div>

                  <button
                    onClick={() => toggleWishlist(service.id, 'service')}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#5C5C5C] hover:text-[#4A0E0E] transition shadow-xs cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'text-[#4A0E0E] fill-[#F2E8E8]' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center space-x-1 bg-[#1A1A1A]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs text-[#FAF7F2]">
                      <Clock className="w-3.5 h-3.5 text-[#F2E8E8]" />
                      <span>{service.durationMinutes} mins session</span>
                    </span>
                    <span className="font-bold text-amber-300">
                      {service.rating}★ ({service.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-luxury font-bold text-base text-[#1A1A1A] line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] line-clamp-2 mt-1 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#888888] uppercase font-bold tracking-wider">Price</span>
                      <p className="text-base font-bold text-[#4A0E0E] font-serif-luxury">₹{service.price}</p>
                    </div>

                    <button
                      onClick={() => onBookService(service)}
                      className="px-5 py-2 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold rounded-full transition cursor-pointer shadow-xs"
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
    </div>
  );
};
