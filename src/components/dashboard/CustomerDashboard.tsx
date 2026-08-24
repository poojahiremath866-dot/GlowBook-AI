import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  User as UserIcon,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { Appointment, Parlor, Service, AIRecommendation } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

interface CustomerDashboardProps {
  initialTab?: 'appointments' | 'wishlist' | 'ai_plans' | 'profile';
  onOpenReviewModal: (appointment: Appointment) => void;
  onExplore: () => void;
  onOpenConsultant: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  initialTab = 'appointments',
  onOpenReviewModal,
  onExplore,
  onOpenConsultant,
}) => {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showNotification } = useNotification();

  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'wishlist' | 'ai_plans' | 'profile'>(initialTab);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [parlorsMap, setParlorsMap] = useState<Record<string, Parlor>>({});

  useEffect(() => {
    loadAppointments();
    api.getParlors().then(res => {
      const map: Record<string, Parlor> = {};
      (res?.parlors || []).forEach(p => { map[p.id] = p; });
      setParlorsMap(map);
    }).catch(err => console.error('Error fetching parlors in dashboard:', err));
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAppointments(user?.id || 'usr-1');
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.updateAppointmentStatus(id, { status: 'cancelled' });
      showNotification('info', 'Booking Cancelled', 'Appointment marked as cancelled.');
      loadAppointments();
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  const handleReschedule = async (id: string) => {
    const newDate = prompt('Enter new preferred date (YYYY-MM-DD):', '2026-09-10');
    const newTime = prompt('Enter new slot time (e.g. 02:00 PM):', '02:00 PM');
    if (!newDate || !newTime) return;

    try {
      await api.updateAppointmentStatus(id, { date: newDate, time: newTime, status: 'confirmed' });
      showNotification('success', 'Appointment Rescheduled', `Rescheduled to ${newDate} at ${newTime}.`);
      loadAppointments();
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Hero Banner */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EAE2D8] shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#EAE2D8] shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
                  {user?.name}
                </h1>
                <Badge variant="rose">Member</Badge>
              </div>
              <p className="text-xs text-[#5C5C5C] mt-1 flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#888888]" />
                <span>{user?.email}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-[#8B4B4B]" />
                <span>{user?.city || 'Bengaluru'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenConsultant}
              className="px-5 py-2.5 bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F2E8E8]" />
              <span>AI Consultation</span>
            </button>
            <button
              onClick={onExplore}
              className="px-5 py-2.5 bg-white hover:bg-[#F2E8E8] text-[#1A1A1A] border border-[#EAE2D8] text-xs font-semibold rounded-full transition cursor-pointer"
            >
              Book New Service
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex space-x-3 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'appointments', label: `My Appointments (${appointments.length})` },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
            { id: 'profile', label: 'Profile & Account' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-[#4A0E0E] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5C5C5C] border border-[#EAE2D8] hover:bg-[#F2E8E8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Appointments */}
        {activeSubTab === 'appointments' && (
          <div className="space-y-8">
            {/* Upcoming Appointments Section */}
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#8B4B4B]" />
                <span>Upcoming Bookings ({upcomingAppointments.length})</span>
              </h2>

              {upcomingAppointments.length === 0 ? (
                <div className="bg-[#FAF7F2] rounded-2xl p-8 text-center border border-[#EAE2D8] space-y-3">
                  <p className="text-[#5C5C5C] text-xs">You have no upcoming salon appointments scheduled.</p>
                  <button
                    onClick={onExplore}
                    className="px-5 py-2.5 bg-[#4A0E0E] text-white text-xs font-semibold rounded-full hover:bg-[#380A0A] transition cursor-pointer"
                  >
                    Discover & Book Parlors
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {upcomingAppointments.map(appt => (
                    <div
                      key={appt.id}
                      className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] hover:border-[#4A0E0E] shadow-xs space-y-4 flex flex-col justify-between transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-[#F2E8E8] text-[#4A0E0E] px-2.5 py-0.5 rounded-full border border-[#EAE2D8]">
                            {appt.bookingCode}
                          </span>
                          <Badge variant="emerald">Confirmed</Badge>
                        </div>

                        <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
                          {appt.serviceName}
                        </h3>

                        <div className="text-xs text-[#5C5C5C] space-y-1 pt-1">
                          <p className="flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#8B4B4B]" />
                            <span>{appt.parlorName}</span>
                          </p>
                          <p className="flex items-center space-x-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-[#888888]" />
                            <span>Stylist: <strong>{appt.beauticianName}</strong></span>
                          </p>
                          <p className="flex items-center space-x-1.5 text-[#1A1A1A] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#888888]" />
                            <span>{appt.date} at {appt.time} ({appt.durationMinutes} mins)</span>
                          </p>
                        </div>

                        {appt.specialRequests && (
                          <div className="bg-white rounded-xl p-2.5 text-[11px] text-[#5C5C5C] italic border border-[#EAE2D8]">
                            Note: "{appt.specialRequests}"
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#888888] uppercase font-medium">Total Paid</span>
                          <p className="text-base font-bold text-[#4A0E0E] font-serif-luxury">₹{appt.totalAmount.toLocaleString()}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleReschedule(appt.id)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A] bg-white hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-full transition cursor-pointer"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appt.id)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-[#8B4B4B] bg-[#F2E8E8] hover:bg-[#EAE2D8] rounded-full transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past History & Reviews Section */}
            <div>
              <h2 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#888888]" />
                <span>Past Appointments ({pastAppointments.length})</span>
              </h2>

              {pastAppointments.length === 0 ? (
                <p className="text-xs text-[#5C5C5C] italic">No past appointments recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {pastAppointments.map(appt => (
                    <div
                      key={appt.id}
                      className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#1A1A1A] font-serif-luxury">{appt.serviceName}</span>
                          <span className="text-[#888888]">•</span>
                          <span className="text-[#5C5C5C]">{appt.parlorName}</span>
                          <Badge variant={appt.status === 'completed' ? 'emerald' : 'stone'}>
                            {appt.status}
                          </Badge>
                        </div>
                        <p className="text-[#888888] text-[11px] mt-0.5">
                          {appt.date} • {appt.beauticianName} • ₹{appt.totalAmount}
                        </p>
                      </div>

                      {appt.status === 'completed' && !appt.reviewed && (
                        <button
                          onClick={() => onOpenReviewModal(appt)}
                          className="px-3.5 py-1.5 bg-[#F2E8E8] text-[#4A0E0E] border border-[#EAE2D8] hover:bg-[#EAE2D8] rounded-full font-semibold text-xs transition cursor-pointer"
                        >
                          ★ Write a Review
                        </button>
                      )}
                      {appt.reviewed && (
                        <span className="text-xs text-emerald-800 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reviewed</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Wishlist */}
        {activeSubTab === 'wishlist' && (
          <div>
            <h2 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] mb-4">
              Saved Favorites ({wishlist.length})
            </h2>
            {wishlist.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-2xl p-8 text-center border border-[#EAE2D8]">
                <Heart className="w-8 h-8 text-[#8B4B4B] mx-auto mb-2" />
                <p className="text-xs text-[#5C5C5C]">Your wishlist is empty. Tap the heart on any parlor or service to save it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlist.map(w => {
                  const parlor = parlorsMap[w.itemId];
                  return (
                    <div key={w.itemId} className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EAE2D8] hover:border-[#4A0E0E] transition space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#4A0E0E] bg-[#F2E8E8] px-2.5 py-0.5 rounded-full border border-[#EAE2D8]">
                          {w.itemType}
                        </span>
                        <button
                          onClick={() => toggleWishlist(w.itemId, w.itemType)}
                          className="text-[#888888] hover:text-[#4A0E0E] text-xs cursor-pointer"
                        >
                          Remove ✕
                        </button>
                      </div>
                      <h4 className="text-sm font-serif-luxury font-bold text-[#1A1A1A]">
                        {parlor ? parlor.name : `Item #${w.itemId}`}
                      </h4>
                      {parlor && (
                        <p className="text-xs text-[#5C5C5C]">{parlor.address}, {parlor.city}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: Profile */}
        {activeSubTab === 'profile' && (
          <div className="max-w-2xl bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#EAE2D8] space-y-6">
            <h2 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
              Account & Profile Details
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] font-medium text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-[#EAE2D8]/40 rounded-xl border border-[#EAE2D8] text-[#888888]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Phone Number</label>
                <input
                  type="tel"
                  defaultValue={user?.phone || '+91 98765 43210'}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] font-medium text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">City / Region</label>
                <input
                  type="text"
                  defaultValue={user?.city || 'Bengaluru'}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] font-medium text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>

              <button
                onClick={() => showNotification('success', 'Profile Saved', 'Account preferences updated successfully.')}
                className="py-3 px-6 bg-[#4A0E0E] hover:bg-[#380A0A] text-white rounded-full font-semibold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
