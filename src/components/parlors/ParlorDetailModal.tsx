import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Star,
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  Scissors,
  Users
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Parlor, Service, Beautician, Review, BeautyPackage } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

interface ParlorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  parlor: Parlor | null;
  services: Service[];
  beauticians: Beautician[];
  reviews: Review[];
  packages: BeautyPackage[];
  onBookService: (service: Service, parlor: Parlor) => void;
  onBookBeautician: (beautician: Beautician, parlor: Parlor) => void;
  onBookParlor: (parlor: Parlor) => void;
}

export const ParlorDetailModal: React.FC<ParlorDetailModalProps> = ({
  isOpen,
  onClose,
  parlor,
  services = [],
  beauticians = [],
  reviews = [],
  packages = [],
  onBookService,
  onBookBeautician,
  onBookParlor,
}) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'services' | 'team' | 'packages' | 'reviews' | 'gallery'>('services');

  if (!parlor) return null;
  const saved = isWishlisted(parlor.id);
  const safeServices = services || [];
  const safeBeauticians = beauticians || [];
  const safeReviews = reviews || [];
  const safePackages = packages || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
    >
      <div className="space-y-0">
        {/* Cover Image & Header Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-stone-900 overflow-hidden">
          <img
            src={parlor.coverImage}
            alt={parlor.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-stone-900 backdrop-blur shadow-sm flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Salon</span>
            </span>
            <Badge variant="rose">{parlor.type}</Badge>
          </div>

          <button
            onClick={() => toggleWishlist(parlor.id, 'parlor')}
            className="absolute top-4 right-14 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-stone-700 hover:text-rose-600 transition shadow-sm cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${saved ? 'text-rose-600 fill-rose-600' : ''}`} />
          </button>

          {/* Bottom Title Info */}
          <div className="absolute bottom-4 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white leading-tight">
                {parlor.name}
              </h2>
              <p className="text-xs text-stone-200 mt-1 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#F2E8E8] shrink-0" />
                <span>{parlor.address}, {parlor.city} • {parlor.distanceKm} km away</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onBookParlor(parlor)}
                className="px-6 py-2.5 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-md transition cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#EAE2D8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <RatingStars rating={parlor.rating} reviewCount={parlor.reviewCount} size="sm" />
          </div>
          <div className="flex items-center space-x-1.5 text-[#5C5C5C]">
            <Clock className="w-3.5 h-3.5 text-[#888888]" />
            <span>{parlor.openingHours}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[#5C5C5C]">
            <Phone className="w-3.5 h-3.5 text-[#888888]" />
            <span>{parlor.phone}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ISO Hygiene Certified</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#EAE2D8] bg-[#FDFBF7] flex items-center space-x-6 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          {[
            { id: 'services', label: `Services (${safeServices.length})` },
            { id: 'team', label: `Master Stylists (${safeBeauticians.length})` },
            { id: 'packages', label: `Packages (${safePackages.length})` },
            { id: 'reviews', label: `Reviews (${safeReviews.length})` },
            { id: 'gallery', label: 'Gallery' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition cursor-pointer whitespace-nowrap text-[11px] font-bold uppercase tracking-wider ${
                activeTab === tab.id
                  ? 'border-[#4A0E0E] text-[#4A0E0E]'
                  : 'border-transparent text-[#5C5C5C] hover:text-[#1A1A1A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 bg-[#FDFBF7]">
          {/* TAB 1: Services */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map(srv => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl border border-[#EAE2D8] bg-[#FAF7F2] hover:border-[#4A0E0E] transition flex items-center justify-between space-x-3"
                  >
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif-luxury font-bold text-[#1A1A1A] truncate">{srv.name}</h4>
                      <p className="text-[10px] text-[#5C5C5C] line-clamp-1">{srv.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-bold text-[#4A0E0E]">₹{srv.price}</span>
                        <span className="text-[10px] text-[#888888]">• {srv.durationMinutes} mins</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookService(srv, parlor)}
                      className="px-3.5 py-1.5 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold rounded-full transition cursor-pointer shrink-0"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Beauticians Team */}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {beauticians.map(b => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl border border-[#EAE2D8] bg-[#FAF7F2] text-center space-y-3 flex flex-col items-center justify-between hover:border-[#4A0E0E] transition"
                >
                  <div className="relative">
                    <img
                      src={b.avatar}
                      alt={b.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#EAE2D8]"
                    />
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-serif-luxury font-bold text-[#1A1A1A]">{b.name}</h4>
                    <p className="text-[10px] text-[#5C5C5C]">{b.role} • {b.experienceYears} yrs</p>
                    <p className="text-[10px] font-semibold text-[#8B4B4B] mt-0.5">{b.specialization}</p>
                    <div className="mt-1 flex justify-center">
                      <RatingStars rating={b.rating} reviewCount={b.reviewCount} size="sm" />
                    </div>
                  </div>
                  <button
                    onClick={() => onBookBeautician(b, parlor)}
                    className="w-full py-1.5 bg-white border border-[#EAE2D8] hover:border-[#4A0E0E] text-[#1A1A1A] text-xs font-semibold rounded-full transition hover:bg-[#F2E8E8] cursor-pointer"
                  >
                    Select Stylist
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Packages */}
          {activeTab === 'packages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-2xl border border-[#EAE2D8] bg-[#FAF7F2] space-y-3 flex flex-col justify-between hover:border-[#4A0E0E] transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#4A0E0E] uppercase bg-[#F2E8E8] px-2.5 py-0.5 rounded-full border border-[#EAE2D8]">
                        {pkg.occasion}
                      </span>
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        ₹{pkg.discountedPrice} <span className="text-[10px] text-[#888888] line-through">₹{pkg.originalPrice}</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-serif-luxury font-bold text-[#1A1A1A] mt-1">{pkg.name}</h4>
                    <p className="text-xs text-[#5C5C5C] mt-1 leading-relaxed">{pkg.description}</p>
                  </div>
                  <button
                    onClick={() => onBookParlor(parlor)}
                    className="w-full py-2 bg-[#4A0E0E] text-white text-xs font-semibold rounded-full hover:bg-[#380A0A] transition cursor-pointer"
                  >
                    Book Package
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-[#5C5C5C] italic py-6 text-center">No reviews yet for this salon.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map(r => (
                    <div key={r.id} className="p-4 rounded-2xl border border-[#EAE2D8] bg-[#FAF7F2] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#1A1A1A]">{r.userName}</span>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Verified Booking
                          </span>
                        </div>
                        <RatingStars rating={r.rating} size="sm" />
                      </div>
                      <p className="text-xs text-[#5C5C5C] italic">"{r.comment}"</p>
                      <p className="text-[10px] text-[#888888]">{r.date} • Stylist: {r.beauticianName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Gallery */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {parlor.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${parlor.name} gallery ${i}`}
                  className="rounded-2xl aspect-square object-cover hover:scale-105 transition-transform border border-[#EAE2D8]"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
