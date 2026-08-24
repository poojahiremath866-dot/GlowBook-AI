import React from 'react';
import { Search, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Discover & Compare',
      description: 'Explore verified luxury parlors, top stylists, real customer reviews, and clear price cards.'
    },
    {
      step: '02',
      icon: Sparkles,
      title: 'AI Consultation',
      description: 'Use GlowBook AI to curate customized packages, style palettes, and skin prep timelines for your occasion.'
    },
    {
      step: '03',
      icon: Calendar,
      title: 'Choose Slot & Stylist',
      description: 'Pick your preferred master beautician and pick verified available date and time slots without double booking.'
    },
    {
      step: '04',
      icon: CheckCircle2,
      title: 'Book & Glow',
      description: 'Enjoy instant confirmation, seamless secure payments (Razorpay/Stripe sandbox), and calendar sync.'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-[#EAE2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B4B4B] bg-[#F2E8E8] px-3.5 py-1 rounded-full border border-[#EAE2D8]">
            Seamless Experience
          </span>
          <h2 className="text-3xl font-serif-luxury font-medium text-[#1A1A1A] mt-3">
            How GlowBook AI Works
          </h2>
          <p className="text-sm text-[#5C5C5C] mt-2">
            Experience effortless beauty booking from smart AI suggestions to salon chair luxury in 4 steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-[#FAF7F2] border border-[#EAE2D8] hover:border-[#4A0E0E] transition-all group"
              >
                <span className="text-4xl font-serif-luxury font-bold text-[#EAE2D8] group-hover:text-[#8B4B4B]/30 transition-colors absolute top-4 right-4">
                  {s.step}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#EAE2D8] flex items-center justify-center text-[#4A0E0E] mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
