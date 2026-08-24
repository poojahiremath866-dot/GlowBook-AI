import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User as UserIcon,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { Parlor, Service, Beautician, BeautyPackage, Appointment, AIRecommendation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { RatingStars } from '../common/RatingStars';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: Service | null;
  initialParlor?: Parlor | null;
  initialPackage?: BeautyPackage | null;
  initialAiRecommendation?: AIRecommendation | null;
  onBookingComplete?: (appointment: Appointment) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  initialService,
  initialParlor,
  initialPackage,
  initialAiRecommendation,
  onBookingComplete,
}) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Booking State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [allParlors, setAllParlors] = useState<Parlor[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [allBeauticians, setAllBeauticians] = useState<Beautician[]>([]);

  const [selectedParlor, setSelectedParlor] = useState<Parlor | null>(initialParlor || null);
  const [selectedService, setSelectedService] = useState<Service | null>(initialService || null);
  const [selectedPackage, setSelectedPackage] = useState<BeautyPackage | null>(initialPackage || null);
  const [selectedAiRec, setSelectedAiRec] = useState<AIRecommendation | null>(initialAiRecommendation || null);
  const [selectedBeautician, setSelectedBeautician] = useState<Beautician | null>(null);

  // Date & Slot state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow default
  );
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // User input details
  const [customerName, setCustomerName] = useState(user?.name || 'Ananya Sharma');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'pay_at_salon'>('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Sync initial props
  useEffect(() => {
    if (isOpen) {
      if (initialService) setSelectedService(initialService);
      if (initialParlor) setSelectedParlor(initialParlor);
      if (initialPackage) setSelectedPackage(initialPackage);
      if (initialAiRecommendation) setSelectedAiRec(initialAiRecommendation);

      // Load initial lists
      api.getParlors().then(res => setAllParlors(res.parlors || []));
      api.getServices().then(res => setAllServices(res.services || []));
      api.getBeauticians().then(res => setAllBeauticians(res.beauticians || []));

      // Determine initial step
      if (initialService || initialPackage || initialAiRecommendation) {
        if (initialParlor) {
          setStep(3); // Go to beautician
        } else {
          setStep(2); // Choose parlor
        }
      } else {
        setStep(1); // Choose service/item
      }
    }
  }, [isOpen, initialService, initialParlor, initialPackage, initialAiRecommendation]);

  // Load available slots whenever beautician, date, or parlor changes
  useEffect(() => {
    if (selectedBeautician && selectedDate) {
      setLoadingSlots(true);
      api.getAvailableSlots({
        beauticianId: selectedBeautician.id,
        date: selectedDate,
        parlorId: selectedParlor?.id,
      })
        .then(res => {
          setAvailableSlots(res.slots || []);
          setSelectedTime('');
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedBeautician, selectedDate, selectedParlor]);

  // Price calculations
  const basePrice = selectedAiRec
    ? selectedAiRec.discountedPrice
    : selectedPackage
    ? selectedPackage.discountedPrice
    : selectedService
    ? selectedService.price
    : 999;

  const durationMins = selectedAiRec
    ? selectedAiRec.recommendedServices.reduce((s, r) => s + r.durationMinutes, 0)
    : selectedPackage
    ? selectedPackage.durationMinutes
    : selectedService
    ? selectedService.durationMinutes
    : 60;

  const itemName = selectedAiRec
    ? selectedAiRec.packageTitle
    : selectedPackage
    ? selectedPackage.name
    : selectedService
    ? selectedService.name
    : 'Beauty Service';

  const taxAmount = Math.round(basePrice * 0.05); // 5% GST
  const finalTotal = Math.max(0, basePrice + taxAmount - discountAmount);

  // Apply Coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'GLOWFIRST20') {
      const disc = Math.round(basePrice * 0.2);
      setDiscountAmount(disc);
      setCouponApplied(true);
      showNotification('success', 'Coupon Applied!', 'GLOWFIRST20 added 20% discount!');
    } else if (couponCode.toUpperCase() === 'BRIDALGLOW') {
      setDiscountAmount(500);
      setCouponApplied(true);
      showNotification('success', 'Coupon Applied!', 'BRIDALGLOW added ₹500 discount!');
    } else if (couponCode.toUpperCase() === 'WEEKENDSPA') {
      setDiscountAmount(300);
      setCouponApplied(true);
      showNotification('success', 'Coupon Applied!', 'WEEKENDSPA added ₹300 discount!');
    } else {
      showNotification('error', 'Invalid Code', 'Please check promo code or try GLOWFIRST20.');
    }
  };

  // Execute Booking & Payment Simulation
  const handleConfirmAndPay = async () => {
    if (!selectedParlor || !selectedBeautician || !selectedDate || !selectedTime) {
      showNotification('error', 'Missing Information', 'Please ensure parlor, beautician, date, and slot are selected.');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // 1. Simulator Payment Checkout
      const checkoutRes = await api.checkout({
        amount: finalTotal,
        currency: 'INR',
        gateway: paymentMethod === 'stripe' ? 'stripe' : 'razorpay'
      });

      // 2. Simulator Payment Verification
      await api.verifyPayment(`pay_sandbox_${Date.now()}`, checkoutRes.orderId);

      // 3. Create Appointment in DB
      const apptRes = await api.createAppointment({
        userId: user?.id || 'usr-1',
        userName: customerName,
        userEmail: user?.email || 'customer@glowbook.com',
        userPhone: customerPhone,
        parlorId: selectedParlor.id,
        parlorName: selectedParlor.name,
        parlorAddress: selectedParlor.address,
        serviceId: selectedService?.id,
        serviceName: itemName,
        packageId: selectedPackage?.id,
        packageName: selectedPackage ? selectedPackage.name : selectedAiRec ? selectedAiRec.packageTitle : undefined,
        beauticianId: selectedBeautician.id,
        beauticianName: selectedBeautician.name,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: durationMins,
        price: basePrice,
        tax: taxAmount,
        discount: discountAmount,
        totalAmount: finalTotal,
        paymentMethod,
        specialRequests
      });

      if (apptRes.success && apptRes.appointment) {
        setConfirmedAppointment(apptRes.appointment);
        setStep(7); // Show Confirmation & Confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showNotification('success', 'Booking Confirmed! 🎉', `Your appointment at ${selectedParlor.name} is reserved.`);
        if (onBookingComplete) onBookingComplete(apptRes.appointment);
      }
    } catch (err: any) {
      showNotification('error', 'Booking Error', err.message || 'Could not complete booking.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Filter beauticians based on chosen parlor
  const filteredBeauticians = selectedParlor
    ? allBeauticians.filter(b => b.parlorId === selectedParlor.id)
    : allBeauticians;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white">
              <CalendarIcon className="w-4 h-4 text-[#F2E8E8]" />
            </div>
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
                {step === 7 ? 'Booking Confirmed' : 'Instant Salon Appointment'}
              </h3>
              <p className="text-xs text-[#5C5C5C] font-sans-clean">
                {step === 7 ? 'Thank you for booking with GlowBook AI' : `Step ${step} of 6 • ${itemName}`}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6 bg-[#FDFBF7]">
        {/* Step Progress Indicators */}
        {step < 7 && (
          <div className="flex items-center justify-between max-w-xl mx-auto px-2">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Parlor' },
              { num: 3, label: 'Stylist' },
              { num: 4, label: 'Slot' },
              { num: 5, label: 'Details' },
              { num: 6, label: 'Payment' },
            ].map(s => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s.num
                      ? 'bg-[#4A0E0E] text-white shadow-sm'
                      : step > s.num
                      ? 'bg-emerald-800 text-white'
                      : 'bg-[#EAE2D8]/60 text-[#888888]'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className="text-[10px] text-[#5C5C5C] mt-1 hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Choose Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
              Select Your Desired Treatment or Package:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {allServices.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => {
                    setSelectedService(srv);
                    setSelectedPackage(null);
                    setSelectedAiRec(null);
                    setStep(2);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    selectedService?.id === srv.id
                      ? 'border-[#4A0E0E] bg-[#F2E8E8] shadow-xs'
                      : 'border-[#EAE2D8] hover:border-[#4A0E0E] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1A1A1A] font-serif-luxury">{srv.name}</p>
                    <p className="text-[10px] text-[#5C5C5C]">{srv.durationMinutes} mins • {srv.category}</p>
                  </div>
                  <span className="text-xs font-bold text-[#4A0E0E]">₹{srv.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Choose Parlor */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
                Select Salon / Studio Location:
              </h4>
              <button onClick={() => setStep(1)} className="text-xs text-[#8B4B4B] font-semibold hover:underline cursor-pointer">
                ← Change Service
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
              {allParlors.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedParlor(p);
                    setStep(3);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    selectedParlor?.id === p.id
                      ? 'border-[#4A0E0E] bg-[#F2E8E8] shadow-xs'
                      : 'border-[#EAE2D8] hover:border-[#4A0E0E] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1A1A1A] font-serif-luxury">{p.name}</p>
                      <p className="text-[10px] text-[#5C5C5C] flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#8B4B4B]" />
                        <span>{p.address} • {p.city}</span>
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-600">{p.rating}★</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EAE2D8]">
                    <span className="text-[#5C5C5C]">{p.type}</span>
                    <span className="text-[#4A0E0E] font-semibold">Select →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Choose Beautician */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
                  Select Master Beautician / Stylist:
                </h4>
                <p className="text-xs text-[#5C5C5C] mt-0.5">At {selectedParlor?.name}</p>
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-[#8B4B4B] font-semibold hover:underline cursor-pointer">
                ← Change Parlor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredBeauticians.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBeautician(b);
                    setStep(4);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                    selectedBeautician?.id === b.id
                      ? 'border-[#4A0E0E] bg-[#F2E8E8] shadow-xs'
                      : 'border-[#EAE2D8] hover:border-[#4A0E0E] bg-[#FAF7F2]'
                  }`}
                >
                  <img
                    src={b.avatar}
                    alt={b.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#EAE2D8]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#1A1A1A] font-serif-luxury truncate">{b.name}</p>
                      <span className="text-[11px] font-bold text-amber-600">{b.rating}★</span>
                    </div>
                    <p className="text-[10px] text-[#5C5C5C] truncate">{b.role} • {b.specialization}</p>
                    <p className="text-[10px] text-emerald-800 font-medium">{b.experienceYears} yrs experience</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Choose Date & Available Slot (Real-time No Double-Booking) */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
                  Select Appointment Date & Verified Slot:
                </h4>
                <p className="text-xs text-[#5C5C5C]">Stylist: <strong>{selectedBeautician?.name}</strong></p>
              </div>
              <button onClick={() => setStep(3)} className="text-xs text-[#8B4B4B] font-semibold hover:underline cursor-pointer">
                ← Change Stylist
              </button>
            </div>

            {/* Date Picker Strip */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                const d = new Date(Date.now() + offset * 86400000);
                const iso = d.toISOString().split('T')[0];
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const isSelected = selectedDate === iso;

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedDate(iso)}
                    className={`shrink-0 p-3 rounded-2xl border text-center transition cursor-pointer min-w-[70px] ${
                      isSelected
                        ? 'bg-[#4A0E0E] text-white border-[#4A0E0E] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#1A1A1A] border-[#EAE2D8] hover:border-[#4A0E0E]'
                    }`}
                  >
                    <p className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#F2E8E8]' : 'text-[#888888]'}`}>
                      {offset === 0 ? 'Today' : dayName}
                    </p>
                    <p className="text-base font-bold font-serif-luxury mt-0.5">{dayNum}</p>
                  </button>
                );
              })}
            </div>

            {/* Slot Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Available Time Slots ({(availableSlots || []).filter(s => s.available).length} open):
                </span>
                <span className="text-[11px] text-[#888888]">Duration: {durationMins} mins</span>
              </div>

              {loadingSlots ? (
                <div className="p-8 text-center text-[#5C5C5C] text-xs flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#4A0E0E]" />
                  <span>Checking real-time calendar availability...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {(availableSlots || []).map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex flex-col items-center justify-center ${
                        !slot.available
                          ? 'bg-[#EAE2D8]/40 text-[#888888] border-[#EAE2D8] cursor-not-allowed opacity-50'
                          : selectedTime === slot.time
                          ? 'bg-[#4A0E0E] text-white border-[#4A0E0E] shadow-sm'
                          : 'bg-[#FAF7F2] text-[#1A1A1A] border-[#EAE2D8] hover:border-[#4A0E0E] hover:bg-[#F2E8E8]'
                      }`}
                    >
                      <span>{slot.time}</span>
                      {!slot.available && <span className="text-[9px] text-rose-500 font-normal">Booked</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(5)}
              disabled={!selectedTime}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] disabled:opacity-40 text-white text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Continue to Contact & Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STEP 5: Customer Details, Promo & Notes */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
                Guest Information & Special Requests
              </h4>
              <button onClick={() => setStep(4)} className="text-xs text-[#8B4B4B] font-semibold hover:underline cursor-pointer">
                ← Change Time Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">
                Special Instructions (Allergies, Skin Type, Hair Length)
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Please avoid latex products, client has very thick waist-length hair..."
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>

            {/* Coupon Code Box */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] space-y-2">
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Have a Promo Coupon?
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. GLOWFIRST20 or BRIDALGLOW"
                  className="flex-1 px-3.5 py-2 bg-white text-[#1A1A1A] text-xs uppercase font-mono rounded-lg border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[#4A0E0E] text-white text-xs font-semibold rounded-lg hover:bg-[#380A0A] transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                  <span>✓ Coupon applied: Saved ₹{discountAmount}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => setStep(6)}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold shadow-md flex items-center justify-center space-x-2 cursor-pointer transition"
            >
              <span>Proceed to Payment Summary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* STEP 6: Payment Simulator & Breakdown */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-widest">
                Order Review & Payment Simulator
              </h4>
              <button onClick={() => setStep(5)} className="text-xs text-[#8B4B4B] font-semibold hover:underline cursor-pointer">
                ← Edit Details
              </button>
            </div>

            {/* Bill Summary */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-serif-luxury font-bold text-sm text-[#1A1A1A]">
                <span>{itemName}</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-[#5C5C5C] flex items-center justify-between">
                <span>Salon: {selectedParlor?.name}</span>
                <span>Stylist: {selectedBeautician?.name}</span>
              </div>
              <div className="text-[11px] text-[#5C5C5C] flex items-center justify-between">
                <span>Date & Time:</span>
                <span className="font-semibold text-[#1A1A1A]">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="pt-2 border-t border-[#EAE2D8] flex items-center justify-between text-[#5C5C5C]">
                <span>GST & Service Fee (5%):</span>
                <span>₹{taxAmount}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-800 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#EAE2D8] flex items-center justify-between text-base font-bold text-[#1A1A1A]">
                <span>Total Amount to Pay:</span>
                <span className="text-[#4A0E0E] font-serif-luxury">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Gateway Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Select Payment Mode (Test Sandbox Active)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'razorpay', label: 'Razorpay UPI / Cards', tag: 'Fast Test' },
                  { id: 'stripe', label: 'Stripe Global Card', tag: '3D Secure' },
                  { id: 'pay_at_salon', label: 'Pay at Salon Counter', tag: 'Pay on Visit' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      paymentMethod === m.id
                        ? 'border-[#4A0E0E] bg-[#F2E8E8] text-[#4A0E0E] shadow-xs'
                        : 'border-[#EAE2D8] bg-[#FAF7F2] text-[#1A1A1A] hover:border-[#4A0E0E]'
                    }`}
                  >
                    <span className="text-xs font-bold">{m.label}</span>
                    <span className="text-[10px] text-[#888888] mt-1">{m.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessingPayment}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Test Sandbox Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#F2E8E8]" />
                  <span>Confirm & Pay ₹{finalTotal.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 7: Confirmation Celebration Card */}
        {step === 7 && confirmedAppointment && (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment & Slot Confirmed
              </span>
              <h4 className="text-2xl font-serif-luxury font-medium text-[#1A1A1A] mt-2">
                Booking Reference: {confirmedAppointment.bookingCode}
              </h4>
              <p className="text-xs text-[#5C5C5C] mt-1">
                A confirmation has been recorded in your GlowBook AI account.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] text-left space-y-3 text-xs max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
                <span className="text-[#5C5C5C]">Service / Package:</span>
                <span className="font-bold text-[#1A1A1A]">{confirmedAppointment.serviceName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
                <span className="text-[#5C5C5C]">Parlor Location:</span>
                <span className="font-bold text-[#1A1A1A]">{confirmedAppointment.parlorName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
                <span className="text-[#5C5C5C]">Master Stylist:</span>
                <span className="font-bold text-[#1A1A1A]">{confirmedAppointment.beauticianName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
                <span className="text-[#5C5C5C]">Date & Slot:</span>
                <span className="font-bold text-[#1A1A1A]">{confirmedAppointment.date} at {confirmedAppointment.time}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-[#1A1A1A] pt-1">
                <span>Paid Total:</span>
                <span className="text-[#4A0E0E] font-serif-luxury">₹{confirmedAppointment.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
              <button
                onClick={() => {
                  const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:GlowBook AI Appointment at ${confirmedAppointment.parlorName}\nDESCRIPTION:${confirmedAppointment.serviceName} with ${confirmedAppointment.beauticianName}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
                  const blob = new Blob([icsData], { type: 'text/calendar' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `appointment-${confirmedAppointment.bookingCode}.ics`;
                  a.click();
                  showNotification('info', 'Calendar Invite', 'Calendar event downloaded.');
                }}
                className="flex-1 py-3 px-4 bg-white hover:bg-[#F2E8E8] text-[#1A1A1A] border border-[#EAE2D8] text-xs font-semibold rounded-full transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold rounded-full transition cursor-pointer shadow-md"
              >
                Done / Return to App
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
