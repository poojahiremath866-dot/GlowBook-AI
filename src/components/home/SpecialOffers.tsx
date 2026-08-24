import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';
import { Offer } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface SpecialOffersProps {
  offers?: Offer[];
  onClaimOffer?: (code: string) => void;
  onApplyOffer?: (code: string) => void;
}

export const SpecialOffers: React.FC<SpecialOffersProps> = ({ offers = [], onClaimOffer, onApplyOffer }) => {
  const { showNotification } = useNotification();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showNotification('success', 'Coupon Copied!', `Promo code ${code} copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2500);
    if (onClaimOffer) onClaimOffer(code);
    if (onApplyOffer) onApplyOffer(code);
  };

  const safeOffers = offers || [];

  return (
    <section className="py-16 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 border border-[#EAE2D8]">
            <Tag className="w-3.5 h-3.5 text-[#8B4B4B]" />
            <span>Exclusive Deals</span>
          </div>
          <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A]">
            Active Promo Codes & Beauty Deals
          </h2>
          <p className="text-sm text-[#5C5C5C] mt-1">
            Apply these instant discount coupons at checkout during your next salon booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-[#4A0E0E] transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#4A0E0E] text-white">
                    {offer.discountPercent}% OFF
                  </span>
                  <span className="text-[11px] text-[#5C5C5C] font-medium">
                    Valid till {offer.validUntil}
                  </span>
                </div>

                <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A] pt-1">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">
                  {offer.description}
                </p>
                <p className="text-[11px] text-[#888888]">
                  Min spend: ₹{offer.minAmount}
                </p>
              </div>

              {/* Coupon Code Strip */}
              <div className="mt-4 pt-3 border-t border-[#EAE2D8] flex items-center justify-between bg-white rounded-2xl p-2.5 border border-[#EAE2D8]">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-[#4A0E0E] tracking-wider">
                    {offer.code}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="px-3.5 py-1 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs font-semibold rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
