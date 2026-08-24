import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedParlors } from './components/home/FeaturedParlors';
import { PopularServices } from './components/home/PopularServices';
import { TrendingPackages } from './components/home/TrendingPackages';
import { AiConsultantBanner } from './components/home/AiConsultantBanner';
import { HowItWorks } from './components/home/HowItWorks';
import { CustomerReviews } from './components/home/CustomerReviews';
import { SpecialOffers } from './components/home/SpecialOffers';

import { ExploreParlorsPage } from './components/explore/ExploreParlorsPage';
import { ExploreServicesPage } from './components/explore/ExploreServicesPage';
import { ExplorePackagesPage } from './components/explore/ExplorePackagesPage';
import { AboutFaqPage } from './components/home/AboutFaqPage';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

import { AiConsultantModal } from './components/ai/AiConsultantModal';
import { AiPackageBuilderModal } from './components/ai/AiPackageBuilderModal';
import { AiStyleModal } from './components/ai/AiStyleModal';
import { GlowBotWidget } from './components/ai/GlowBotWidget';
import { ParlorDetailModal } from './components/parlors/ParlorDetailModal';
import { BookingFlowModal } from './components/booking/BookingFlowModal';
import { AuthModal } from './components/auth/AuthModal';
import { AddReviewModal } from './components/review/AddReviewModal';

import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { api } from './services/api';
import { Parlor, Service, Beautician, BeautyPackage, Review, Appointment, AIRecommendation, Offer } from './types';
import { Bot, Sparkles, Wand2 } from 'lucide-react';

export function App() {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  // Loaded Data Repositories
  const [parlors, setParlors] = useState<Parlor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [beauticians, setBeauticians] = useState<Beautician[]>([]);
  const [packages, setPackages] = useState<BeautyPackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals Visibility
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isPackageBuilderOpen, setIsPackageBuilderOpen] = useState(false);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false);
  const [isGlowBotOpen, setIsGlowBotOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isParlorDetailOpen, setIsParlorDetailOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Selected entities for modals
  const [selectedParlor, setSelectedParlor] = useState<Parlor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<BeautyPackage | null>(null);
  const [selectedAiRec, setSelectedAiRec] = useState<AIRecommendation | null>(null);
  const [reviewingAppointment, setReviewingAppointment] = useState<Appointment | null>(null);

  // Fetch initial app data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, bRes, pkgRes, rRes, oRes] = await Promise.all([
        api.getParlors(),
        api.getServices(),
        api.getBeauticians(),
        api.getPackages(),
        api.getReviews(),
        api.getOffers(),
      ]);
      setParlors(pRes.parlors || []);
      setServices(sRes.services || []);
      setBeauticians(bRes.beauticians || []);
      setPackages(pkgRes.packages || []);
      setReviews(rRes.reviews || []);
      setOffers(oRes.offers || []);
    } catch (err) {
      console.error('Failed loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler helpers
  const handleSelectParlor = (parlor: Parlor) => {
    setSelectedParlor(parlor);
    setIsParlorDetailOpen(true);
  };

  const handleBookParlor = (parlor: Parlor) => {
    setSelectedParlor(parlor);
    setSelectedService(null);
    setSelectedPackage(null);
    setSelectedAiRec(null);
    setIsParlorDetailOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleBookService = (service: Service, parlor?: Parlor) => {
    setSelectedService(service);
    if (parlor) {
      setSelectedParlor(parlor);
    } else {
      const matched = parlors.find(p => p.id === service.parlorId);
      if (matched) setSelectedParlor(matched);
    }
    setSelectedPackage(null);
    setSelectedAiRec(null);
    setIsParlorDetailOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleBookPackage = (pkg: BeautyPackage) => {
    setSelectedPackage(pkg);
    setSelectedService(null);
    setSelectedAiRec(null);
    const matched = parlors.find(p => p.id === pkg.parlorId) || parlors[0];
    if (matched) setSelectedParlor(matched);
    setIsBookingModalOpen(true);
  };

  const handleBookAiRec = (rec: AIRecommendation) => {
    setSelectedAiRec(rec);
    setSelectedPackage(null);
    setSelectedService(null);
    setSelectedParlor(parlors[0]);
    setIsBookingModalOpen(true);
  };

  const handleBookBeautician = (beautician: Beautician, parlor: Parlor) => {
    setSelectedParlor(parlor);
    setSelectedService(null);
    setSelectedPackage(null);
    setIsParlorDetailOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveTab('services');
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'consultant') {
      setIsConsultantOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenAiConsultant={() => setIsConsultantOpen(true)}
        onOpenPackageBuilder={() => setIsPackageBuilderOpen(true)}
        onOpenStyleAi={() => setIsStyleModalOpen(true)}
        onOpenGlowBot={() => setIsGlowBotOpen(true)}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-0">
            <Hero
              onExplore={() => handleNavigate('explore')}
              onOpenConsultant={() => setIsConsultantOpen(true)}
            />

            <CategoryGrid onSelectCategory={handleCategorySelect} />

            <FeaturedParlors
              parlors={parlors}
              onSelectParlor={handleSelectParlor}
              onBookParlor={handleBookParlor}
              onViewAll={() => handleNavigate('explore')}
            />

            <PopularServices
              services={services}
              onBookService={handleBookService}
              onViewAll={() => handleNavigate('services')}
            />

            <TrendingPackages
              packages={packages}
              onBookPackage={handleBookPackage}
              onViewAll={() => handleNavigate('packages')}
              onOpenAiBuilder={() => setIsPackageBuilderOpen(true)}
            />

            <AiConsultantBanner
              onOpenConsultant={() => setIsConsultantOpen(true)}
              onOpenStyleMatcher={() => setIsStyleModalOpen(true)}
            />

            <HowItWorks onOpenBooking={() => setIsBookingModalOpen(true)} />

            <SpecialOffers
              offers={offers}
              onClaimOffer={(code) => {
                showNotification('info', 'Promo Code Copied!', `Use code ${code} during checkout to save.`);
                setIsBookingModalOpen(true);
              }}
            />

            <CustomerReviews reviews={reviews} />
          </div>
        )}

        {/* VIEW: EXPLORE PARLORS */}
        {activeTab === 'explore' && (
          <ExploreParlorsPage
            parlors={parlors}
            initialCity={selectedCity}
            onSelectParlor={handleSelectParlor}
            onBookParlor={handleBookParlor}
            onOpenConsultant={() => setIsConsultantOpen(true)}
          />
        )}

        {/* VIEW: SERVICES */}
        {activeTab === 'services' && (
          <ExploreServicesPage
            services={services}
            parlors={parlors}
            onBookService={handleBookService}
            onOpenConsultant={() => setIsConsultantOpen(true)}
          />
        )}

        {/* VIEW: PACKAGES */}
        {activeTab === 'packages' && (
          <ExplorePackagesPage
            packages={packages}
            onBookPackage={handleBookPackage}
            onOpenAiBuilder={() => setIsPackageBuilderOpen(true)}
            onOpenConsultant={() => setIsConsultantOpen(true)}
          />
        )}

        {/* VIEW: ABOUT & FAQ */}
        {activeTab === 'about' && (
          <AboutFaqPage
            onExplore={() => handleNavigate('explore')}
            onOpenConsultant={() => setIsConsultantOpen(true)}
          />
        )}

        {/* VIEW: WISHLIST */}
        {activeTab === 'wishlist' && (
          <CustomerDashboard
            initialTab="wishlist"
            onOpenReviewModal={(appt) => {
              setReviewingAppointment(appt);
              setIsReviewModalOpen(true);
            }}
            onExplore={() => handleNavigate('explore')}
            onOpenConsultant={() => setIsConsultantOpen(true)}
          />
        )}

        {/* VIEW: OWNER DASHBOARD */}
        {activeTab === 'owner-dashboard' && (
          <OwnerDashboard />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {/* VIEW: DASHBOARD (Role Adaptive: Customer, Owner, Admin) */}
        {activeTab === 'dashboard' && (
          <div>
            {user?.role === 'ADMIN' ? (
              <AdminDashboard />
            ) : user?.role === 'OWNER' ? (
              <OwnerDashboard />
            ) : (
              <CustomerDashboard
                onOpenReviewModal={(appt) => {
                  setReviewingAppointment(appt);
                  setIsReviewModalOpen(true);
                }}
                onExplore={() => handleNavigate('explore')}
                onOpenConsultant={() => setIsConsultantOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating GlowBot AI Concierge Trigger */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-2">
        <button
          onClick={() => setIsGlowBotOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-3.5 bg-stone-900 hover:bg-rose-600 text-white rounded-full shadow-2xl hover:shadow-rose-600/30 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-rose-300 group-hover:text-white transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-tight">GlowBot AI</p>
            <p className="text-[10px] text-stone-300 leading-tight">Ask Beauty Concierge</p>
          </div>
        </button>
      </div>

      {/* Interactive AI Chatbot Concierge Widget */}
      <GlowBotWidget
        isOpen={isGlowBotOpen}
        onClose={() => setIsGlowBotOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultant={() => setIsConsultantOpen(true)}
        onOpenGlowBot={() => setIsGlowBotOpen(true)}
      />

      {/* MODALS */}
      {/* 1. AI Skin/Hair Consultant Modal */}
      <AiConsultantModal
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        onBookRecommendation={handleBookAiRec}
      />

      {/* 2. AI Package Builder Modal */}
      <AiPackageBuilderModal
        isOpen={isPackageBuilderOpen}
        onClose={() => setIsPackageBuilderOpen(false)}
        onBookPackage={handleBookAiRec}
      />

      {/* 3. AI Style & Color Palette Matcher Modal */}
      <AiStyleModal
        isOpen={isStyleModalOpen}
        onClose={() => setIsStyleModalOpen(false)}
        onBookServiceByName={(name) => {
          const match = services.find(s => s.name.toLowerCase().includes(name.toLowerCase())) || services[0];
          handleBookService(match);
        }}
      />

      {/* 4. Parlor Detail & Team Modal */}
      <ParlorDetailModal
        isOpen={isParlorDetailOpen}
        onClose={() => setIsParlorDetailOpen(false)}
        parlor={selectedParlor}
        services={services.filter(s => !selectedParlor || s.parlorId === selectedParlor.id)}
        beauticians={beauticians.filter(b => !selectedParlor || b.parlorId === selectedParlor.id)}
        reviews={reviews.filter(r => !selectedParlor || r.parlorId === selectedParlor.id)}
        packages={packages.filter(p => !selectedParlor || p.parlorId === selectedParlor.id)}
        onBookService={handleBookService}
        onBookBeautician={handleBookBeautician}
        onBookParlor={handleBookParlor}
      />

      {/* 5. Booking Flow & Payment Simulator Modal */}
      <BookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialParlor={selectedParlor}
        initialService={selectedService}
        initialPackage={selectedPackage}
        initialAiRecommendation={selectedAiRec}
        onBookingComplete={(appt) => {
          loadAllData();
        }}
      />

      {/* 6. Auth / Sign In Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 7. Verified Customer Review Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        appointment={reviewingAppointment}
        onReviewSubmitted={() => {
          loadAllData();
        }}
      />
    </div>
  );
}

export default App;
