import React from 'react';
import { Sparkles, Search, MapPin, Calendar, ArrowRight, ShieldCheck, Star, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExplore: () => void;
  onOpenConsultant: () => void;
  onOpenBooking: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onExecuteSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onOpenConsultant,
  onOpenBooking,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  onExecuteSearch,
}) => {
  const cities = ['All Cities', 'Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Belagavi', 'Hyderabad', 'Chennai'];
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'hair', label: 'Hair Cuts & Spa' },
    { id: 'skin', label: 'Facials & Skin' },
    { id: 'makeup', label: 'Bridal & Party Makeup' },
    { id: 'nails', label: 'Nails & Pedicure' },
    { id: 'spa', label: 'Aromatherapy Spa' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Subtle Warm Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-4 left-10 w-96 h-96 rounded-full bg-[#F2E8E8]/40 blur-3xl" />
        <div className="absolute top-20 right-10 w-[450px] h-[450px] rounded-full bg-[#FAF7F2]/80 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#EAE2D8]/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill */}
            <div>
              <span className="inline-block px-3.5 py-1 bg-[#F2E8E8] text-[#8B4B4B] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]/60">
                Discover Your Glow
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-[58px] leading-[1.08] font-light text-[#1A1A1A] tracking-tight">
              Your Beauty. Your Style.<br />
              <span className="italic text-[#4A0E0E] font-medium">
                Perfectly Scheduled.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#5C5C5C] text-base sm:text-lg max-w-xl leading-relaxed">
              Connect with top-tier beauty professionals and receive AI-driven style curation tailored to your unique features and upcoming events.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="bg-[#4A0E0E] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-[#4A0E0E]/20 hover:bg-[#380A0A] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenConsultant}
                className="border-2 border-[#4A0E0E] text-[#4A0E0E] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#F2E8E8]/40 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#4A0E0E]" />
                <span>Try AI Consultant</span>
              </button>

              <button
                onClick={onExplore}
                className="border border-[#EAE2D8] bg-white text-[#1A1A1A] px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-[#FAF7F2] transition cursor-pointer shadow-xs"
              >
                <span>Explore Parlors</span>
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 border-t border-[#EAE2D8] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold font-serif-luxury text-[#1A1A1A]">4.9★</span>
                </div>
                <p className="text-xs text-[#5C5C5C] font-medium">Top Rated Experts</p>
              </div>
              <div>
                <div className="text-2xl font-bold font-serif-luxury text-[#1A1A1A]">100%</div>
                <p className="text-xs text-[#5C5C5C] font-medium">Verified Parlors</p>
              </div>
              <div>
                <div className="text-2xl font-bold font-serif-luxury text-[#1A1A1A]">Instant</div>
                <p className="text-xs text-[#5C5C5C] font-medium">Slot Confirmation</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main Card Image */}
              <div className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#F2F0ED] relative group">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=85"
                  alt="Luxury Beauty Salon"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#4A0E0E] text-white">
                    Featured Studio
                  </span>
                  <h3 className="text-xl font-bold font-serif-luxury text-white leading-tight">
                    Aura Luxury Salon & Bridal Lounge
                  </h3>
                  <p className="text-xs text-[#EAE2D8] flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F2E8E8]" />
                    <span>Indiranagar, Bengaluru</span>
                  </p>
                </div>
              </div>

              {/* Floating AI Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#EAE2D8] max-w-[210px]"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#F2E8E8] flex items-center justify-center text-[#4A0E0E]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">AI Match Score</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">98% Perfect Fit</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Booking Confirmation Pill */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#EAE2D8] max-w-[230px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#4A0E0E] border border-[#EAE2D8]">
                    <Clock className="w-5 h-5 text-[#4A0E0E]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Available Today</p>
                    <p className="text-[11px] text-[#5C5C5C]">Slots open from 11:00 AM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Integrated Floating Search & Discovery Bar */}
        <div className="mt-12 bg-white rounded-3xl p-5 shadow-sm border border-[#EAE2D8] max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-1.5">
                Service or Parlor
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Bridal Makeup, HydraFacial Pro, Balayage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onExecuteSearch()}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:outline-none focus:border-[#4A0E0E]"
                />
              </div>
            </div>

            {/* City Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:outline-none focus:border-[#4A0E0E] cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:outline-none focus:border-[#4A0E0E] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2 pt-1 lg:pt-5">
              <button
                onClick={onExecuteSearch}
                className="w-full py-2.5 px-4 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold shadow-md shadow-[#4A0E0E]/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
