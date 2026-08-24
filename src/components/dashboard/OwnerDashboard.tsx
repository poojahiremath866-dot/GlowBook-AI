import React, { useState, useEffect } from 'react';
import {
  Store,
  Calendar,
  DollarSign,
  Users,
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  Tag,
  Scissors
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { Service, Beautician, Appointment, Parlor } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { Modal } from '../common/Modal';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [beauticians, setBeauticians] = useState<Beautician[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('hair');
  const [newServicePrice, setNewServicePrice] = useState(1200);
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // New Stylist Modal State
  const [isStylistModalOpen, setIsStylistModalOpen] = useState(false);
  const [newStylistName, setNewStylistName] = useState('');
  const [newStylistRole, setNewStylistRole] = useState('Senior Hair Stylist');
  const [newStylistExp, setNewStylistExp] = useState(6);
  const [newStylistSpec, setNewStylistSpec] = useState('Balayage & Scalp Spa');

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const [statsRes, srvRes, beauRes, apptRes] = await Promise.all([
        api.getOwnerStats('parlor-1'),
        api.getServices(),
        api.getBeauticians({ parlorId: 'parlor-1' }),
        api.getAppointments(undefined, 'parlor-1'),
      ]);
      setStats(statsRes);
      setServices(srvRes.services || []);
      setBeauticians(beauRes.beauticians || []);
      setAppointments(apptRes.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    try {
      const res = await api.createService({
        name: newServiceName,
        category: newServiceCategory as any,
        price: Number(newServicePrice),
        durationMinutes: Number(newServiceDuration),
        description: newServiceDesc || 'High performance salon treatment with organic botanical extracts.',
        parlorId: 'parlor-1',
        popular: true,
        rating: 4.9,
        reviewCount: 1
      });
      if (res.success) {
        setServices(prev => [res.service, ...prev]);
        setIsServiceModalOpen(false);
        showNotification('success', 'Service Added', `${newServiceName} is now visible to customers.`);
      }
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      showNotification('info', 'Service Removed', 'Service deleted from salon catalog.');
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  const handleCreateStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStylistName) return;
    try {
      const res = await api.createBeautician({
        name: newStylistName,
        role: newStylistRole,
        experienceYears: Number(newStylistExp),
        specialization: newStylistSpec,
        parlorId: 'parlor-1',
        rating: 4.9,
        reviewCount: 2,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      });
      if (res.success) {
        setBeauticians(prev => [...prev, res.beautician]);
        setIsStylistModalOpen(false);
        showNotification('success', 'Stylist Added', `${newStylistName} added to salon roster.`);
      }
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  const handleUpdateApptStatus = async (id: string, status: string) => {
    try {
      await api.updateAppointmentStatus(id, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
      showNotification('success', 'Status Updated', `Appointment marked as ${status}.`);
    } catch (err: any) {
      showNotification('error', 'Error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Owner Header */}
        <div className="bg-[#4A0E0E] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#EAE2D8]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F2E8E8] text-[#4A0E0E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5" />
              <span>Salon Owner Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              Aura Luxury Salon & Bridal Lounge
            </h1>
            <p className="text-xs text-[#F2E8E8]/80 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#F2E8E8]" />
              <span>Indiranagar 100ft Road, Bengaluru • Owner: Sunita Rao</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsServiceModalOpen(true)}
              className="px-5 py-2.5 bg-[#FAF7F2] hover:bg-[#F2E8E8] text-[#4A0E0E] text-xs uppercase tracking-wider font-semibold rounded-full shadow-sm flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
            <button
              onClick={() => setIsStylistModalOpen(true)}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-semibold rounded-full transition cursor-pointer flex items-center space-x-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Add Beautician</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Revenue</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              ₹{(stats?.totalRevenue || 48500).toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24% from last month</span>
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Total Bookings</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              {appointments.length || 18}
            </p>
            <p className="text-[10px] text-[#5C5C5C]">Across all stylists</p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Master Stylists</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#1A1A1A]">
              {beauticians.length}
            </p>
            <p className="text-[10px] text-emerald-800 font-semibold">Active & on-duty</p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#EAE2D8] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider">Salon Rating</span>
            <p className="text-2xl font-serif-luxury font-bold text-[#4A0E0E]">
              4.9★
            </p>
            <p className="text-[10px] text-[#5C5C5C]">Based on 142 verified client reviews</p>
          </div>
        </div>

        {/* Live Booking Pipeline */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A]">
                Live Appointment Pipeline & Schedule
              </h3>
              <p className="text-xs text-[#5C5C5C]">Real-time incoming customer bookings</p>
            </div>
            <span className="text-xs font-bold text-[#4A0E0E] bg-[#F2E8E8] px-3.5 py-1 rounded-full border border-[#EAE2D8]">
              {appointments.length} Appointments Total
            </span>
          </div>

          <div className="divide-y divide-[#EAE2D8] max-h-96 overflow-y-auto">
            {appointments.map(appt => (
              <div key={appt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#4A0E0E] bg-[#F2E8E8] px-2 py-0.5 rounded border border-[#EAE2D8]">
                      {appt.bookingCode}
                    </span>
                    <span className="font-bold text-[#1A1A1A]">{appt.userName}</span>
                    <span className="text-[#888888]">({appt.userPhone})</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-white text-[#5C5C5C] border border-[#EAE2D8]'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-[#5C5C5C]">
                    <strong>{appt.serviceName}</strong> with <em>{appt.beauticianName}</em> on <strong>{appt.date} @ {appt.time}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#1A1A1A] font-serif-luxury mr-2">₹{appt.totalAmount}</span>
                  {appt.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateApptStatus(appt.id, 'completed')}
                      className="px-3.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full font-semibold text-[11px] transition cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                  {appt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')}
                      className="px-3 py-1 text-[#8B4B4B] hover:bg-[#F2E8E8] rounded-full text-[11px] font-semibold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services & Team Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Column */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A]">Salon Services Catalog ({services.length})</h3>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="text-xs text-[#4A0E0E] font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="divide-y divide-[#EAE2D8] max-h-80 overflow-y-auto pr-1">
              {services.map(srv => (
                <div key={srv.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{srv.name}</p>
                    <p className="text-[10px] text-[#5C5C5C]">{srv.category} • {srv.durationMinutes} mins</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-[#4A0E0E] font-serif-luxury">₹{srv.price}</span>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-[#888888] hover:text-[#8B4B4B] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beauticians Column */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE2D8] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif-luxury font-bold text-[#1A1A1A]">Active Stylists Roster ({beauticians.length})</h3>
              <button
                onClick={() => setIsStylistModalOpen(true)}
                className="text-xs text-[#4A0E0E] font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stylist</span>
              </button>
            </div>

            <div className="divide-y divide-[#EAE2D8] max-h-80 overflow-y-auto pr-1">
              {beauticians.map(b => (
                <div key={b.id} className="py-2.5 flex items-center space-x-3 text-xs">
                  <img src={b.avatar} alt={b.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-[#EAE2D8]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1A1A] truncate">{b.name}</p>
                    <p className="text-[10px] text-[#5C5C5C] truncate">{b.role} • {b.experienceYears} yrs • {b.specialization}</p>
                  </div>
                  <span className="font-bold text-[#4A0E0E] text-xs">{b.rating}★</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Add New Salon Service"
      >
        <form onSubmit={handleCreateService} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Service Name</label>
            <input
              type="text"
              required
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="e.g. 24K Saffron Glow Facial"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-sm text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Category</label>
              <select
                value={newServiceCategory}
                onChange={(e) => setNewServiceCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              >
                <option value="hair">Hair</option>
                <option value="skin">Skin</option>
                <option value="makeup">Makeup</option>
                <option value="nails">Nails</option>
                <option value="spa">Spa</option>
                <option value="threading">Threading</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Price (₹)</label>
              <input
                type="number"
                value={newServicePrice}
                onChange={(e) => setNewServicePrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Duration (Mins)</label>
              <input
                type="number"
                value={newServiceDuration}
                onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Description</label>
            <textarea
              rows={2}
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              placeholder="Detailed description of treatment and benefits..."
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider rounded-full transition cursor-pointer shadow-sm"
          >
            Create Service
          </button>
        </form>
      </Modal>

      {/* Add Stylist Modal */}
      <Modal
        isOpen={isStylistModalOpen}
        onClose={() => setIsStylistModalOpen(false)}
        title="Add Master Beautician to Roster"
      >
        <form onSubmit={handleCreateStylist} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Stylist Full Name</label>
            <input
              type="text"
              required
              value={newStylistName}
              onChange={(e) => setNewStylistName(e.target.value)}
              placeholder="e.g. Shalini Menon"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-sm text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Role Title</label>
              <input
                type="text"
                value={newStylistRole}
                onChange={(e) => setNewStylistRole(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Experience (Years)</label>
              <input
                type="number"
                value={newStylistExp}
                onChange={(e) => setNewStylistExp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase tracking-wider mb-1">Specialization</label>
            <input
              type="text"
              value={newStylistSpec}
              onChange={(e) => setNewStylistSpec(e.target.value)}
              placeholder="e.g. Hydra Facials, Russian Nail Art..."
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider rounded-full transition cursor-pointer shadow-sm"
          >
            Add Stylist
          </button>
        </form>
      </Modal>
    </div>
  );
};
