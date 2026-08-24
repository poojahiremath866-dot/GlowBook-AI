import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  Star,
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Parlor } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface ExploreParlorsPageProps {
  parlors: Parlor[];
  initialCity?: string;
  onSelectParlor: (parlor: Parlor) => void;
  onBookParlor: (parlor: Parlor) => void;
  onOpenConsultant: () => void;
}

export const ExploreParlorsPage: React.FC<ExploreParlorsPageProps> = ({
  parlors = [],
  initialCity = 'All',
  onSelectParlor,
  onBookParlor,
  onOpenConsultant,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(
    initialCity && initialCity !== 'All Cities' ? initialCity : 'All'
  );
  const [selectedType, setSelectedType] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'distance'>('rating');
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  const cities = ['All', 'Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Belagavi', 'Hyderabad', 'Chennai'];
  const parlorTypes = ['All', 'Luxury Spa', 'Bridal Studio', 'Unisex Salon', 'Nail Bar', 'Boutique Salon'];
  const allAmenities = ['Valet Parking', 'Bridal Suite', 'Beverages', 'Organic Products', 'AC Private Rooms'];

  const filteredParlors = useMemo(() => {
    return (parlors || [])
      .filter(p => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity = selectedCity === 'All' || p.city.toLowerCase() === selectedCity.toLowerCase();
        const matchesType = selectedType === 'All' || p.type.toLowerCase().includes(selectedType.toLowerCase());
        const matchesRating = p.rating >= minRating;
        const matchesPrice = p.startingPrice <= maxPrice;
        const matchesAmenity = !selectedAmenity || (p.amenities || []).includes(selectedAmenity);

        return matchesQuery && matchesCity && matchesType && matchesRating && matchesPrice && matchesAmenity;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price_asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        return 0;
      });
  }, [parlors, searchQuery, selectedCity, selectedType, minRating, maxPrice, sortBy, selectedAmenity]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All');
    setSelectedType('All');
    setMinRating(0);
    setMaxPrice(3000);
    setSelectedAmenity(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title Banner */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EAE2D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Beauty Lounges & Salons</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
              Discover Top Salons in Your City
            </h1>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Compare ratings, verified beauticians, hygiene standards, and real-time appointment slots
            </p>
          </div>

          <button
            onClick={onOpenConsultant}
            className="px-6 py-3 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-md shadow-[#4A0E0E]/20 flex items-center space-x-2 transition cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Match Salon for Me</span>
          </button>
        </div>

        {/* Main Grid: Filters Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTER SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#FAF7F2] rounded-3xl p-5 border border-[#EAE2D8] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center space-x-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#4A0E0E]" />
                  <span>Filters</span>
                </span>
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#4A0E0E] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider mb-2">
                  City / Region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedCity(c)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        selectedCity === c
                          ? 'bg-[#4A0E0E] text-white'
                          : 'bg-white border border-[#EAE2D8] text-[#5C5C5C] hover:bg-[#F2E8E8]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salon Type */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider mb-2">
                  Salon Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-xs font-medium text-[#1A1A1A]"
                >
                  {parlorTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider mb-1.5">
                  <span>Max Starting Price</span>
                  <span className="text-[#4A0E0E] font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="499"
                  max="5000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#4A0E0E] cursor-pointer"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider mb-2">
                  Minimum Rating
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                  {[0, 4.5, 4.8].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`py-1.5 rounded-full border text-center transition cursor-pointer ${
                        minRating === r
                          ? 'bg-[#F2E8E8] border-[#4A0E0E] text-[#4A0E0E] font-bold'
                          : 'border-[#EAE2D8] bg-white text-[#5C5C5C] hover:bg-[#F2E8E8]'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="block text-[10px] font-bold text-[#8B4B4B] uppercase tracking-wider mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allAmenities.map(am => (
                    <button
                      key={am}
                      onClick={() => setSelectedAmenity(selectedAmenity === am ? null : am)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                        selectedAmenity === am
                          ? 'bg-[#4A0E0E] text-white'
                          : 'bg-white border border-[#EAE2D8] text-[#5C5C5C] hover:bg-[#F2E8E8]'
                      }`}
                    >
                      {am}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS COLUMN */}
          <div className="lg:col-span-9 space-y-5">
            {/* Search Bar & Sorting Toolbar */}
            <div className="bg-[#FAF7F2] rounded-3xl p-3 sm:p-4 border border-[#EAE2D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by salon name, area, or city..."
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-[#EAE2D8] text-xs focus:ring-2 focus:ring-[#4A0E0E]/20"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs">
                <span className="text-[#5C5C5C] whitespace-nowrap">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-white rounded-full border border-[#EAE2D8] text-xs font-semibold text-[#1A1A1A]"
                >
                  <option value="rating">Highest Rated ★</option>
                  <option value="price_asc">Lowest Price ₹</option>
                  <option value="distance">Nearest Distance 📍</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider">
                Showing {filteredParlors.length} Verified Parlors
              </span>
            </div>

            {/* Parlors Grid */}
            {filteredParlors.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-12 text-center border border-[#EAE2D8] space-y-3">
                <MapPin className="w-10 h-10 text-[#888888] mx-auto" />
                <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A]">No salons matched your filters</h3>
                <p className="text-xs text-[#5C5C5C] max-w-sm mx-auto">
                  Try adjusting your budget slider, city selection, or search keywords.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-[#4A0E0E] text-white rounded-full text-xs font-semibold hover:bg-[#380A0A] transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParlors.map(parlor => {
                  const saved = isWishlisted(parlor.id);
                  return (
                    <div
                      key={parlor.id}
                      className="group bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EAE2D8] hover:border-[#4A0E0E] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D8]/40">
                        <img
                          src={parlor.coverImage}
                          alt={parlor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                          {parlor.featured && <Badge variant="rose">Featured</Badge>}
                          <Badge variant="stone">{parlor.type}</Badge>
                        </div>

                        <button
                          onClick={() => toggleWishlist(parlor.id, 'parlor')}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#5C5C5C] hover:text-[#4A0E0E] transition shadow-xs cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${saved ? 'text-[#4A0E0E] fill-[#F2E8E8]' : ''}`} />
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="flex items-center space-x-1 bg-[#1A1A1A]/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs text-[#FAF7F2]">
                            <MapPin className="w-3 h-3 text-[#F2E8E8]" />
                            <span>{parlor.distanceKm} km • {parlor.city}</span>
                          </span>
                          <span className="font-bold text-amber-300">
                            {parlor.rating}★ ({parlor.reviewCount})
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-800 font-semibold mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Verified Salon Partner</span>
                          </div>
                          <h3
                            onClick={() => onSelectParlor(parlor)}
                            className="font-serif-luxury font-bold text-base text-[#1A1A1A] hover:text-[#4A0E0E] transition cursor-pointer line-clamp-1"
                          >
                            {parlor.name}
                          </h3>
                          <p className="text-xs text-[#5C5C5C] line-clamp-1 mt-0.5">{parlor.address}</p>

                          {/* Amenity tags */}
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {parlor.amenities.slice(0, 3).map((am, i) => (
                              <span key={i} className="text-[10px] bg-white border border-[#EAE2D8] text-[#5C5C5C] px-2.5 py-0.5 rounded-full">
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#888888] uppercase font-bold tracking-wider">Starts from</span>
                            <p className="text-sm font-bold text-[#1A1A1A] font-serif-luxury">₹{parlor.startingPrice}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onSelectParlor(parlor)}
                              className="px-3.5 py-1.5 bg-white border border-[#EAE2D8] hover:bg-[#FAF7F2] text-[#1A1A1A] text-xs font-semibold rounded-full transition cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => onBookParlor(parlor)}
                              className="px-4 py-1.5 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold rounded-full transition cursor-pointer shadow-xs"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
