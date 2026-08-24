import React, { useState } from 'react';
import { Gift, Sparkles, Plus, Check, Loader2, ArrowRight, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { AIRecommendation } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface AiPackageBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookPackage: (rec: AIRecommendation) => void;
}

export const AiPackageBuilderModal: React.FC<AiPackageBuilderModalProps> = ({
  isOpen,
  onClose,
  onBookPackage,
}) => {
  const { showNotification } = useNotification();

  const [occasion, setOccasion] = useState('Festive Family Celebration');
  const [budget, setBudget] = useState(5000);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Hydra Glow Facial',
    'Hair Spa & Cut',
    'Manicure & Pedicure'
  ]);
  const [loading, setLoading] = useState(false);
  const [builtPackage, setBuiltPackage] = useState<AIRecommendation | null>(null);

  const availableTags = [
    'Hydra Glow Facial',
    '24K Gold Facial',
    'Keratin Smoothing',
    'Hair Spa & Cut',
    'Bridal HD Makeup',
    'Airbrush Party Makeup',
    'Manicure & Pedicure',
    'Aroma Body Spa',
    'Eyebrow Lamination & Tint',
    'Full Arms & Legs Waxing',
    'D-Tan Glow Treatment'
  ];

  const toggleTag = (tag: string) => {
    if (selectedServices.includes(tag)) {
      setSelectedServices(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedServices(prev => [...prev, tag]);
    }
  };

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.buildAiPackage({
        occasion,
        budget,
        desiredServices: selectedServices,
      });

      if (res.success && res.package) {
        setBuiltPackage(res.package);
        showNotification('ai', 'Package Built!', 'Gemini calculated an optimized bundle with maximum savings.');
      }
    } catch (err: any) {
      showNotification('error', 'Builder Error', err.message || 'Failed to construct package.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white">
            <Gift className="w-4 h-4 text-[#F2E8E8]" />
          </div>
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
              AI Personalized Package Builder
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Bundle services together with AI-negotiated package discounts
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6 bg-[#FDFBF7]">
        {!builtPackage ? (
          <form onSubmit={handleBuild} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Target Occasion / Celebration
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Sister's Sangeet, Pre-Bridal Glow, Graduation Day..."
                className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-sm rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Target Budget
                </label>
                <span className="text-xs font-bold text-[#4A0E0E] font-serif-luxury">₹{budget.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1500"
                max="25000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#4A0E0E] cursor-pointer"
              />
            </div>

            {/* Desired Services multi-select tags */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                Select Desired Services to Bundle ({selectedServices.length} selected):
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedServices.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#4A0E0E] text-white font-semibold shadow-xs'
                          : 'bg-[#FAF7F2] text-[#1A1A1A] border border-[#EAE2D8] hover:bg-[#F2E8E8]'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 text-[#F2E8E8]" /> : <Plus className="w-3 h-3 text-[#888888]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || selectedServices.length === 0}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F2E8E8]" />
                  <span>Optimizing Package Synergy & Price...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F2E8E8]" />
                  <span>Calculate Custom Package Bundle</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="bg-[#4A0E0E] text-white p-6 rounded-3xl border border-[#EAE2D8]/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2E8E8]/90">
                  Custom AI Bundle
                </span>
                <span className="text-[11px] bg-white/10 text-[#F2E8E8] px-2.5 py-0.5 rounded-full font-semibold">
                  Save ₹{builtPackage.savingsAmount}
                </span>
              </div>
              <h4 className="text-xl font-serif-luxury font-bold text-white">
                {builtPackage.packageTitle}
              </h4>
              <p className="text-xs text-[#F2E8E8]/90 leading-relaxed">
                {builtPackage.summary}
              </p>
              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                <span className="text-xs text-[#EAE2D8]">Total Bundle Price:</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold font-serif-luxury text-[#FAF7F2]">
                    ₹{builtPackage.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#EAE2D8]/70 line-through">
                    ₹{builtPackage.totalEstimatedPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Services in Bundle:
              </h5>
              <div className="space-y-2">
                {builtPackage.recommendedServices.map((srv, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-serif-luxury font-bold text-[#1A1A1A]">{srv.name}</p>
                      <p className="text-[10px] text-[#5C5C5C]">{srv.durationMinutes} mins • {srv.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-[#4A0E0E]">₹{srv.estimatedPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBuiltPackage(null)}
                className="py-3 px-5 rounded-full border border-[#EAE2D8] bg-white text-[#1A1A1A] text-xs font-semibold hover:bg-[#FAF7F2] transition cursor-pointer"
              >
                ← Edit Choices
              </button>
              <button
                onClick={() => {
                  onBookPackage(builtPackage);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Book This Custom Package (₹{builtPackage.discountedPrice})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
