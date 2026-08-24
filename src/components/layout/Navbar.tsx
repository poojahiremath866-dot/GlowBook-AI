import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Search,
  Calendar,
  ShieldCheck,
  Store,
  Compass,
  Scissors,
  Gift,
  Palette,
  ChevronDown,
  LogOut,
  SlidersHorizontal,
  Bot
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  onOpenAuth?: () => void;
  onOpenAuthModal?: () => void;
  onOpenConsultant?: () => void;
  onOpenAiConsultant?: () => void;
  onOpenPackageBuilder?: () => void;
  onOpenStyleAi?: () => void;
  onOpenGlowBot?: () => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNavigate,
  onOpenAuth,
  onOpenAuthModal,
  onOpenConsultant,
  onOpenAiConsultant,
  onOpenPackageBuilder,
  onOpenStyleAi,
  onOpenGlowBot,
  selectedCity = 'All Cities',
  setSelectedCity,
}) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    }
    if (onNavigate) {
      onNavigate(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClick = () => {
    if (onOpenAuth) onOpenAuth();
    if (onOpenAuthModal) onOpenAuthModal();
  };

  const handleConsultantClick = () => {
    if (onOpenConsultant) onOpenConsultant();
    if (onOpenAiConsultant) onOpenAiConsultant();
  };

  const cities = ['All Cities', 'Bengaluru', 'Mysuru', 'Hubballi', 'Dharwad', 'Belagavi', 'Hyderabad', 'Chennai'];

  const navLinks = [
    { id: 'home', label: 'Home', domId: 'nav-home' },
    { id: 'explore', label: 'Explore Parlors', domId: 'nav-explore' },
    { id: 'services', label: 'Services', domId: 'nav-services' },
    { id: 'packages', label: 'Packages & Offers', domId: 'nav-packages' },
    { id: 'about', label: 'About & FAQ', domId: 'nav-about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE2D8] transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#4A0E0E] text-[#F2E8E8] text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-wide">✨ Festive Wedding Season 2026: Get 20% OFF with code <strong className="text-white">GLOWFIRST20</strong></span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-[#F2E8E8]/70">Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter beauty parlors by city"
              className="bg-[#360808] text-white rounded px-2 py-0.5 border border-[#8B4B4B]/40 focus:outline-none focus:border-[#F2E8E8] cursor-pointer"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="h-3 w-px bg-[#8B4B4B]/40" />
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-1 text-[#F2E8E8] hover:text-white font-medium cursor-pointer"
              >
                <span>Role: <strong>{role}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#EAE2D8] py-1 text-[#1A1A1A] z-50">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#888888] tracking-wider">Switch Demo Persona</div>
                  <button
                    onClick={() => { switchDemoRole('CUSTOMER'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-[#FAF7F2] ${role === 'CUSTOMER' ? 'font-bold text-[#4A0E0E] bg-[#F2E8E8]/40' : ''}`}
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Customer (Ananya)</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('OWNER'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-[#FAF7F2] ${role === 'OWNER' ? 'font-bold text-[#4A0E0E] bg-[#F2E8E8]/40' : ''}`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Salon Owner (Sunita)</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('ADMIN'); setRoleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-[#FAF7F2] ${role === 'ADMIN' ? 'font-bold text-[#4A0E0E] bg-[#F2E8E8]/40' : ''}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Platform Admin (Kavita)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white shadow-md shadow-[#4A0E0E]/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#4A0E0E] font-serif-luxury group-hover:text-[#360808] transition-colors">
                  GlowBook AI
                </span>
              </div>
              <p className="text-[9px] text-[#888888] uppercase tracking-[0.2em] -mt-0.5 font-semibold hidden sm:block">
                Professional Beauty & Salon
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={link.domId}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-xs uppercase tracking-widest font-medium transition-all cursor-pointer ${
                  activeTab === link.id
                    ? 'text-[#4A0E0E] font-bold border-b-2 border-[#4A0E0E] pb-1'
                    : 'text-[#1A1A1A] hover:text-[#4A0E0E] pb-1'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* AI Feature Pill Buttons in Header */}
            <button
              id="btn-nav-ai-consultant"
              type="button"
              onClick={handleConsultantClick}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#4A0E0E] text-white shadow-sm hover:bg-[#380A0A] flex items-center space-x-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Consultant</span>
            </button>

            <button
              id="btn-nav-pkg-builder"
              type="button"
              onClick={onOpenPackageBuilder}
              className="px-3.5 py-2 text-xs font-semibold rounded-full bg-[#F2E8E8] text-[#8B4B4B] border border-[#EAE2D8] hover:bg-[#ecdada] flex items-center space-x-1.5 cursor-pointer transition-all"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Package Builder</span>
            </button>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-3">
            {/* GlowBot Quick Button */}
            <button
              id="btn-nav-glowbot"
              type="button"
              onClick={onOpenGlowBot}
              title="Chat with GlowBot AI"
              className="p-2.5 rounded-full text-[#4A0E0E] bg-[#F2E8E8] hover:bg-[#ecdada] border border-[#EAE2D8] transition-colors relative cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </button>

            {/* Wishlist */}
            <button
              id="btn-nav-wishlist"
              type="button"
              onClick={() => handleNavClick('wishlist')}
              className="p-2.5 rounded-full text-[#5C5C5C] hover:text-[#4A0E0E] hover:bg-[#FAF7F2] transition-colors relative cursor-pointer"
              title="My Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-[#4A0E0E] fill-[#F2E8E8]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A0E0E] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Role Dashboards shortcut */}
            {role === 'OWNER' && (
              <button
                id="btn-nav-owner-console"
                type="button"
                onClick={() => handleNavClick('owner-dashboard')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FAF7F2] text-[#4A0E0E] border border-[#EAE2D8] rounded-full hover:bg-[#F2E8E8] transition cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Owner Console</span>
              </button>
            )}

            {role === 'ADMIN' && (
              <button
                id="btn-nav-admin-console"
                type="button"
                onClick={() => handleNavClick('admin-dashboard')}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FAF7F2] text-[#4A0E0E] border border-[#EAE2D8] rounded-full hover:bg-[#F2E8E8] transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-nav-user-dropdown"
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pl-2.5 rounded-full bg-white border border-[#EAE2D8] hover:border-[#4A0E0E] transition-all cursor-pointer shadow-xs"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-[#F2E8E8]"
                  />
                  <span className="text-xs font-semibold text-[#1A1A1A] hidden md:block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888888] mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#EAE2D8] py-2 z-50 text-[#1A1A1A]">
                    <div className="px-4 py-2 border-b border-[#EAE2D8]">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#888888] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F2E8E8] text-[#8B4B4B] border border-[#EAE2D8]">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => { handleNavClick('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF7F2] flex items-center space-x-2 text-[#1A1A1A] cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#4A0E0E]" />
                        <span>My Bookings & Profile</span>
                      </button>

                      {user.role === 'OWNER' && (
                        <button
                          type="button"
                          onClick={() => { handleNavClick('owner-dashboard'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF7F2] flex items-center space-x-2 text-[#4A0E0E] font-medium cursor-pointer"
                        >
                          <Store className="w-3.5 h-3.5 text-[#4A0E0E]" />
                          <span>Parlor Management</span>
                        </button>
                      )}

                      {user.role === 'ADMIN' && (
                        <button
                          type="button"
                          onClick={() => { handleNavClick('admin-dashboard'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF7F2] flex items-center space-x-2 text-[#4A0E0E] font-medium cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4A0E0E]" />
                          <span>Platform Admin Console</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => { handleNavClick('wishlist'); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#FAF7F2] flex items-center space-x-2 text-[#1A1A1A] cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-[#4A0E0E]" />
                        <span>Wishlist ({wishlistCount})</span>
                      </button>
                    </div>

                    <div className="border-t border-[#EAE2D8] pt-1">
                      <button
                        type="button"
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-[#8B4B4B] hover:bg-[#F2E8E8] flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  id="btn-nav-login"
                  type="button"
                  onClick={handleAuthClick}
                  className="text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] hover:text-[#4A0E0E] cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="btn-nav-join"
                  type="button"
                  onClick={handleAuthClick}
                  className="bg-[#4A0E0E] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#380A0A] shadow-md shadow-[#4A0E0E]/20 transition cursor-pointer"
                >
                  Join GlowBook
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              id="btn-nav-mobile-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-[#1A1A1A] hover:bg-[#FAF7F2] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAE2D8] px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <span className="text-xs font-bold text-[#888888] uppercase tracking-wider">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity && setSelectedCity(e.target.value)}
              className="bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-lg px-2.5 py-1 border border-[#EAE2D8]"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              type="button"
              onClick={() => { handleConsultantClick(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-xs font-semibold rounded-full bg-[#4A0E0E] text-white flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Consultant</span>
            </button>
            <button
              type="button"
              onClick={() => { if (onOpenPackageBuilder) onOpenPackageBuilder(); setMobileMenuOpen(false); }}
              className="px-3 py-2 text-xs font-semibold rounded-full bg-[#F2E8E8] text-[#8B4B4B] border border-[#EAE2D8] flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Package Builder</span>
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => { handleNavClick(link.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold cursor-pointer ${
                  activeTab === link.id ? 'bg-[#F2E8E8] text-[#4A0E0E] font-bold' : 'text-[#1A1A1A] hover:bg-[#FAF7F2]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => { if (onOpenStyleAi) onOpenStyleAi(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center space-x-2 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[#888888]" />
              <span>AI Style Recommendations</span>
            </button>

            <button
              type="button"
              onClick={() => { handleNavClick('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-medium text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#4A0E0E]" />
              <span>My Appointments</span>
            </button>

            {role === 'OWNER' && (
              <button
                type="button"
                onClick={() => { handleNavClick('owner-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider text-[#4A0E0E] bg-[#F2E8E8] font-bold flex items-center space-x-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#4A0E0E]" />
                <span>Owner Dashboard</span>
              </button>
            )}

            {role === 'ADMIN' && (
              <button
                type="button"
                onClick={() => { handleNavClick('admin-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider text-[#4A0E0E] bg-[#F2E8E8] font-bold flex items-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#4A0E0E]" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
