import React, { useState } from 'react';
import { Sparkles, Check, Clock, Calendar, Gift, ArrowRight, Loader2, Info, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { AIRecommendation } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface AiConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAiPackage: (rec: AIRecommendation) => void;
  defaultCity?: string;
}

export const AiConsultantModal: React.FC<AiConsultantModalProps> = ({
  isOpen,
  onClose,
  onBookAiPackage,
  defaultCity = 'Bengaluru',
}) => {
  const { showNotification } = useNotification();

  const [occasion, setOccasion] = useState('Wedding Guest / Sangeet');
  const [budget, setBudget] = useState(4000);
  const [preferredStyle, setPreferredStyle] = useState('HD Glamorous Glow');
  const [timeline, setTimeline] = useState('In 3 days');
  const [city, setCity] = useState(defaultCity);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);

  const occasions = [
    'Bridal / Wedding Ceremony',
    'Wedding Guest / Sangeet',
    'Cocktail / Evening Reception',
    'Birthday / Anniversary',
    'Job Interview / Corporate Event',
    'Weekend Self-Care Glow',
    'Pre-Bridal Month Package'
  ];

  const styles = [
    'HD Glamorous Glow',
    'Natural No-Makeup Dewy',
    'Royal Traditional Indian',
    'Korean Glass Skin & Pastel',
    'Bold Smoky Eyes & Nude Lips'
  ];

  const timelines = ['Today / Urgent', 'Tomorrow', 'In 2-3 days', 'Next Weekend', 'In 2+ Weeks'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.getAiConsultation({
        occasion,
        budget,
        preferredStyle,
        availableTime: timeline,
        city,
        userInput: userInput || `Looking for ${preferredStyle} services for ${occasion} within ₹${budget}.`,
      });

      if (res.success && res.recommendation) {
        setRecommendation(res.recommendation);
        showNotification('ai', 'AI Consultation Ready!', 'Gemini crafted your personalized beauty plan.');
      }
    } catch (err: any) {
      showNotification('error', 'Consultation Error', err.message || 'Could not reach AI advisor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-[#F2E8E8]" />
          </div>
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
              AI Beauty Consultant
            </h3>
            <p className="text-xs text-[#5C5C5C] font-normal">
              Personalized Regimen & Custom Bundles
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6 bg-[#FDFBF7]">
        {!recommendation ? (
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="bg-[#F2E8E8] rounded-2xl p-4 border border-[#EAE2D8] flex items-start space-x-2.5 text-xs text-[#4A0E0E]">
              <Info className="w-4 h-4 text-[#4A0E0E] shrink-0 mt-0.5" />
              <span>
                Tell our AI your occasion, budget, and desired look. GlowBook AI calculates service synergy, timing recommendations, and exact cost savings.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Occasion */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Occasion / Event
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-sm rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                >
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Target Budget
                  </label>
                  <span className="text-xs font-bold text-[#4A0E0E] font-serif-luxury">₹{budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#4A0E0E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#888888] mt-1">
                  <span>₹1,000</span>
                  <span>₹10,000</span>
                  <span>₹20,000+</span>
                </div>
              </div>

              {/* Preferred Style */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Preferred Aesthetic / Style
                </label>
                <select
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-sm rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                >
                  {styles.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  When is the Event?
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-sm rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                >
                  {timelines.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Specific Concerns / Skin Type (Optional)
              </label>
              <textarea
                rows={2}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g. Sensitive dry skin, looking for frizz-free hair styling that lasts 8 hours in humidity..."
                className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F2E8E8]" />
                  <span>Crafting Your Regimen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F2E8E8]" />
                  <span>Generate Personalized Beauty Plan</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Recommendation Output View */
          <div className="space-y-6">
            {/* Header Result Card */}
            <div className="bg-[#4A0E0E] text-white p-6 rounded-3xl shadow-sm border border-[#EAE2D8]/20 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/15">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2E8E8]/90">
                    AI Custom Package
                  </span>
                  <h4 className="text-xl font-serif-luxury font-bold text-white">
                    {recommendation.packageTitle}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-serif-luxury font-bold text-[#FAF7F2]">
                      ₹{recommendation.discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#EAE2D8]/70 line-through">
                      ₹{recommendation.totalEstimatedPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F2E8E8] font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                    Saved ₹{recommendation.savingsAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#F2E8E8]/90 mt-3 leading-relaxed">
                {recommendation.summary}
              </p>
            </div>

            {/* Recommended Services List */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Recommended Services Synergy ({(recommendation.recommendedServices || []).length}):
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(recommendation.recommendedServices || []).map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif-luxury font-bold text-[#1A1A1A]">{srv.name}</span>
                      <span className="text-xs font-bold text-[#4A0E0E]">₹{srv.estimatedPrice}</span>
                    </div>
                    <p className="text-[11px] text-[#5C5C5C] leading-snug">{srv.reason}</p>
                    <div className="flex items-center space-x-1 text-[10px] text-[#888888] pt-1">
                      <Clock className="w-3 h-3 text-[#888888]" />
                      <span>{srv.durationMinutes} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2] border border-[#EAE2D8] rounded-2xl p-4 space-y-2">
                <h6 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B4B4B]" />
                  <span>Prep Timeline & Timing</span>
                </h6>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">
                  {recommendation.recommendedTimeline}
                </p>
              </div>

              <div className="bg-[#F2E8E8] border border-[#EAE2D8] rounded-2xl p-4 space-y-2">
                <h6 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-wider flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#4A0E0E]" />
                  <span>Pro Beauty Tips</span>
                </h6>
                <ul className="space-y-1 text-xs text-[#4A0E0E]">
                  {recommendation.tips.map((t, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-[#4A0E0E] font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setRecommendation(null)}
                className="py-3 px-5 rounded-full border border-[#EAE2D8] bg-white text-[#1A1A1A] text-xs font-semibold hover:bg-[#FAF7F2] transition text-center cursor-pointer"
              >
                ← Adjust Parameters
              </button>

              <button
                onClick={() => {
                  onBookAiPackage(recommendation);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Book This Full Regimen (₹{recommendation.discountedPrice.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
