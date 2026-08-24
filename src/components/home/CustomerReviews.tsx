import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { Review } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface CustomerReviewsProps {
  reviews: Review[];
  onOpenReviewModal?: () => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, onOpenReviewModal }) => {
  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B4B4B]">
              Verified Client Stories
            </span>
            <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A] mt-1">
              Loved by Discerning Clients
            </h2>
            <p className="text-sm text-[#5C5C5C] mt-1">
              Read authentic feedback from customers who booked through GlowBook AI across Indian cities.
            </p>
          </div>

          {onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="mt-4 md:mt-0 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4A0E0E] bg-white border border-[#EAE2D8] px-5 py-2.5 rounded-full shadow-xs hover:bg-[#FAF7F2] transition cursor-pointer"
            >
              Write a Review
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RatingStars rating={rev.rating} size="sm" />
                  <span className="text-[11px] text-[#888888]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#5C5C5C] leading-relaxed italic">
                  "{rev.comment}"
                </p>

                {(rev.serviceName || rev.beauticianName) && (
                  <div className="pt-2 text-[11px] text-[#888888] border-t border-[#EAE2D8] flex flex-wrap gap-x-2">
                    {rev.serviceName && <span>Service: <strong className="text-[#1A1A1A] font-semibold">{rev.serviceName}</strong></span>}
                    {rev.beauticianName && <span>• Stylist: <strong className="text-[#1A1A1A] font-semibold">{rev.beauticianName}</strong></span>}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <img
                  src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={rev.userName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EAE2D8]"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-[#1A1A1A]">{rev.userName}</span>
                    {rev.verifiedBooking && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" title="Verified Customer" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#888888]">Verified Booking</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
