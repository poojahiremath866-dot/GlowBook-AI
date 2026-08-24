import React from 'react';
import { Sparkles, Heart, Shield, Phone, Mail, MapPin, Instagram, Facebook, Twitter, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenConsultant: () => void;
  onOpenGlowBot?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultant, onOpenGlowBot }) => {
  return (
    <footer className="bg-[#1A1A1A] text-[#FAF7F2]/80 pt-16 pb-12 border-t border-[#EAE2D8]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2E2E2E]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white shadow-md shadow-[#4A0E0E]/40">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white">
                GlowBook <span className="font-sans-clean text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#4A0E0E] text-[#F2E8E8] border border-[#8B4B4B]/50">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#FAF7F2]/70 leading-relaxed max-w-sm">
              The premier AI-powered discovery and booking platform uniting discerning clients with master beauticians and luxury salons across India.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#262626] border border-[#3D3D3D] text-xs text-[#EAE2D8]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Verified Parlors</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#262626] border border-[#3D3D3D] text-xs text-[#EAE2D8]">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Hygiene Certified</span>
              </span>
            </div>
          </div>

          {/* Discovery Col */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EAE2D8] mb-4">Discover</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition cursor-pointer">
                  Explore Parlors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  All Beauty Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-white transition cursor-pointer">
                  Packages & Offers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-white transition cursor-pointer">
                  Bridal Studios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  Spa & Wellness
                </button>
              </li>
            </ul>
          </div>

          {/* AI Features Col */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EAE2D8] mb-4">AI Beauty Suite</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={onOpenConsultant} className="hover:text-white transition text-[#F2E8E8] font-semibold flex items-center space-x-1 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2E8E8]" />
                  <span>AI Consultant</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenGlowBot && onOpenGlowBot()} className="hover:text-white transition text-[#FAF7F2]/80 flex items-center space-x-1 cursor-pointer">
                  <span>GlowBot Concierge</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenConsultant} className="hover:text-white transition cursor-pointer">
                  Package Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  Skin Prep Timeline
                </button>
              </li>
            </ul>
          </div>

          {/* Cities & Support */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#EAE2D8] mb-4">Cities</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-[#FAF7F2]/70 mb-4">
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Bengaluru</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Mysuru</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Hubballi</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Dharwad</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Belagavi</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Hyderabad</span>
              <span className="px-2.5 py-1 bg-[#262626] rounded-md border border-[#333]">Chennai</span>
            </div>
            <div className="text-xs text-[#FAF7F2]/70 space-y-1.5">
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#F2E8E8]" />
                <span>support@glowbook.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#F2E8E8]" />
                <span>+91 80 4000 8800</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/60">
          <p>© 2026 GlowBook AI. Full-Stack Beauty & Salon Platform. Crafted for College Portfolio.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
              Parlor Partner Onboarding
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
