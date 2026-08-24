import React, { useState } from 'react';
import { Sparkles, User, Store, ShieldCheck, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchDemoRole } = useAuth();
  const { showNotification } = useNotification();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await register(name, email, role, phone);
        showNotification('success', 'Welcome!', `Account created for ${name}.`);
      } else {
        await login(email, password, role);
        showNotification('success', 'Signed In', 'Welcome back to GlowBook AI.');
      }
      onClose();
    } catch (err: any) {
      showNotification('error', 'Authentication Failed', err.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (targetRole: UserRole) => {
    switchDemoRole(targetRole);
    showNotification('success', `Signed in as Demo ${targetRole}`, `Switched persona to ${targetRole}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-[#F2E8E8]" />
          </div>
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
              {isSignUp ? 'Create GlowBook Account' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-[#5C5C5C] font-normal">
              {isSignUp ? 'Join the salon network' : 'Sign in to access your bookings & wishlist'}
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-5 bg-[#FDFBF7]">
        {/* Quick Demo Sign-In Buttons */}
        <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EAE2D8] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#888888] text-center">
            ⚡ 1-Click Fast Test Personas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="p-2.5 bg-white hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-xl text-center transition cursor-pointer"
            >
              <User className="w-4 h-4 text-[#4A0E0E] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#1A1A1A]">Customer</span>
              <span className="block text-[9px] text-[#888888]">Ananya</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('OWNER')}
              className="p-2.5 bg-white hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-xl text-center transition cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#8B4B4B] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#1A1A1A]">Salon Owner</span>
              <span className="block text-[9px] text-[#888888]">Sunita Rao</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2.5 bg-white hover:bg-[#F2E8E8] border border-[#EAE2D8] rounded-xl text-center transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#4A0E0E] mx-auto mb-1" />
              <span className="block text-[11px] font-bold text-[#1A1A1A]">Admin</span>
              <span className="block text-[9px] text-[#888888]">Kavita Patel</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[#EAE2D8]"></div>
          <span className="flex-shrink mx-3 text-[10px] text-[#888888] uppercase font-bold tracking-wider">or use credentials</span>
          <div className="flex-grow border-t border-[#EAE2D8]"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-bold text-[#1A1A1A] uppercase mb-1 text-[11px]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Sharma"
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-xs text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase mb-1 text-[11px]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@glowbook.com"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-xs text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1A1A1A] uppercase mb-1 text-[11px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-xs text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase mb-1 text-[11px]">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-xs text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1A1A] uppercase mb-1 text-[11px]">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#EAE2D8] text-xs text-[#1A1A1A] focus:border-[#4A0E0E] focus:outline-none"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="OWNER">Salon Owner</option>
                  <option value="ADMIN">Platform Admin</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider rounded-full transition cursor-pointer text-xs shadow-sm mt-2"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#4A0E0E] font-semibold hover:underline cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
