import React from 'react';
import { Sparkles, Bot, Palette, Gift, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface AiConsultantBannerProps {
  onOpenConsultant: () => void;
  onOpenPackageBuilder: () => void;
  onOpenStyleAi: () => void;
}

export const AiConsultantBanner: React.FC<AiConsultantBannerProps> = ({
  onOpenConsultant,
  onOpenPackageBuilder,
  onOpenStyleAi,
}) => {
  return (
    <section className="py-16 bg-[#4A0E0E] text-white relative overflow-hidden">
      {/* Decorative Shimmer Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-[#8B4B4B]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-[#360808]/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#F2E8E8]/20 border border-[#F2E8E8]/30 text-[#F2E8E8] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Zap className="w-3.5 h-3.5 text-[#F2E8E8]" />
              <span>Powered by Gemini 3.7 Flash & Beauty Intelligence</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
              Personalized AI Beauty Concierge & <span className="italic font-medium">Smart Package Builder</span>
            </h2>

            <p className="text-[#FAF7F2]/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Not sure which treatment matches your skin tone, hair texture, or upcoming celebration? Tell our AI your event, budget, and skin goals for an instant custom grooming plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <Sparkles className="w-5 h-5 text-[#F2E8E8] mb-2" />
                <h4 className="text-sm font-bold text-white">Skin & Hair Advisor</h4>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">Personalized regimen tailored to your occasion & timeline.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <Gift className="w-5 h-5 text-[#F2E8E8] mb-2" />
                <h4 className="text-sm font-bold text-white">Custom Package AI</h4>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">Smart bundles tailored to fit your exact budget with savings.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <Palette className="w-5 h-5 text-[#F2E8E8] mb-2" />
                <h4 className="text-sm font-bold text-white">Visual Style Matcher</h4>
                <p className="text-xs text-[#FAF7F2]/70 mt-1">Upload outfit photos for color palette & makeover ideas.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={onOpenConsultant}
                className="px-7 py-3.5 rounded-full bg-white text-[#4A0E0E] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-bold shadow-lg shadow-black/20 flex items-center space-x-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#4A0E0E]" />
                <span>Start AI Consultation</span>
              </button>

              <button
                onClick={onOpenPackageBuilder}
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs uppercase tracking-wider font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Build Custom Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive AI Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-white/15 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white border border-[#8B4B4B]/50">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live AI Beauty Recommendation</h3>
                    <p className="text-[11px] text-[#F2E8E8]/70">Target: Wedding Reception • Budget: ₹4,500</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-700/50">
                  Optimal Match
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                  <p className="text-[#F2E8E8] font-bold mb-1.5 uppercase text-[10px] tracking-wider">Recommended Package Bundle:</p>
                  <p className="text-[#FAF7F2]/80 leading-relaxed text-xs">
                    1. 24K Gold Collagen Facial (45m)<br />
                    2. HD Soft Glam Makeup with Lashes (60m)<br />
                    3. Crown Blowout & Volumizing Finish (30m)
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#FAF7F2]/60">Total Duration: <strong>135 Mins</strong></span>
                  <span className="text-white font-bold text-sm">Bundle Price: ₹3,899 <span className="text-[10px] text-emerald-400 font-normal">(Saved ₹900)</span></span>
                </div>

                <div className="bg-[#4A0E0E]/40 rounded-xl p-3 border border-[#8B4B4B]/40 text-xs text-[#F2E8E8]">
                  💡 <strong>Stylist Tip:</strong> Complete the facial 48 hours before the reception for optimal skin hydration.
                </div>
              </div>

              <button
                onClick={onOpenConsultant}
                className="w-full py-3 rounded-full bg-white text-[#4A0E0E] text-xs uppercase tracking-wider font-bold hover:bg-[#FAF7F2] transition text-center cursor-pointer shadow-md"
              >
                Try Your Personalized Consultation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
