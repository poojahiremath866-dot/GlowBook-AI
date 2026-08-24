import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  ArrowRight
} from 'lucide-react';

interface AboutFaqPageProps {
  onExplore: () => void;
  onOpenConsultant: () => void;
}

export const AboutFaqPage: React.FC<AboutFaqPageProps> = ({ onExplore, onOpenConsultant }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does GlowBook AI verify beauty salons and parlors?',
      a: 'Every salon listed on GlowBook AI undergoes a strict 18-point verification protocol, covering hygiene audits, sterilizer machinery checks, genuine organic product authentication, and beautician trade certification verification.'
    },
    {
      q: 'How does the AI Beauty Consultant recommendation engine work?',
      a: 'Our AI engine analyzes your specific skin type, hair texture, occasion requirements, and budget constraints to generate personalized beauty service stacks, treatment prep timelines, and stylist matches in real time.'
    },
    {
      q: 'Can I reschedule or cancel my appointment?',
      a: 'Yes, you can easily reschedule or cancel your appointment free of charge up to 2 hours prior to your scheduled slot directly from your Customer Dashboard.'
    },
    {
      q: 'Are the prices shown on GlowBook AI inclusive of all taxes?',
      a: 'Yes, all prices displayed include GST and salon hygiene consumables. No hidden charges are applied at checkout or at the salon counter.'
    },
    {
      q: 'How do custom AI Beauty Packages work?',
      a: 'Our AI Package Builder allows you to bundle complementary services (e.g., Hydra Facial + Keratin Hair Spa + Gel Manicure) at exclusive discounted package rates of 20% to 35% OFF.'
    },
    {
      q: 'How can a salon owner partner with GlowBook AI?',
      a: 'Salon owners can list their salon through the Owner Console to manage appointments, staff schedules, customer reviews, and promotional offers with zero upfront listing fees.'
    }
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2E8E8] text-[#8B4B4B] text-xs font-bold uppercase tracking-widest border border-[#EAE2D8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Excellence In Beauty & Wellness</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
            About GlowBook AI
          </h1>
          <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
            India’s premier AI-powered beauty discovery and booking ecosystem, connecting clients with top-rated luxury parlors, bridal lounges, and master stylists.
          </p>
        </div>

        {/* Pillars / Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#EAE2D8] shadow-xs hover:border-[#4A0E0E] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E8E8] text-[#4A0E0E] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
              100% Certified Salons
            </h3>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Every salon and beauty parlor is verified for hygiene safety, authentic products, and certified beauticians.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#EAE2D8] shadow-xs hover:border-[#4A0E0E] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E8E8] text-[#4A0E0E] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
              AI Intelligent Matching
            </h3>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Instant skin and hair analysis, automated wedding package builders, and smart slot recommendations.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#EAE2D8] shadow-xs hover:border-[#4A0E0E] transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E8E8] text-[#4A0E0E] flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
              Best Price Guarantee
            </h3>
            <p className="text-xs text-[#5C5C5C] leading-relaxed">
              Transparent upfront pricing, verified customer reviews, and seasonal discount coupons without surprise charges.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE2D8] shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE2D8] pb-6">
            <div>
              <h2 className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[#5C5C5C] mt-1">
                Everything you need to know about booking, services, and salon partners.
              </p>
            </div>
            <button
              onClick={onOpenConsultant}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#4A0E0E] text-white text-xs font-semibold hover:bg-[#380A0A] transition cursor-pointer shadow-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Consultant</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? 'border-[#4A0E0E] bg-[#FAF7F2]/60' : 'border-[#EAE2D8] bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#1A1A1A]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#4A0E0E] shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#888888] shrink-0 ml-4" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-xs text-[#5C5C5C] leading-relaxed border-t border-[#EAE2D8]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#4A0E0E] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif-luxury font-bold">
              Ready to experience luxury pampering?
            </h3>
            <p className="text-xs sm:text-sm text-[#F2E8E8]/80 max-w-xl">
              Explore hundreds of verified beauty parlors near you and reserve your preferred stylist in seconds.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-white text-[#4A0E0E] rounded-full text-xs font-bold hover:bg-[#F2E8E8] transition cursor-pointer shadow-md flex items-center space-x-2"
            >
              <span>Explore Salons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
