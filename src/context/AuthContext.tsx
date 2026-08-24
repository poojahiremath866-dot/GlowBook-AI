import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, role: UserRole, phone?: string, city?: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'customer@glowbook.com',
    role: 'CUSTOMER',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'Bengaluru',
    createdAt: '2026-01-10T10:00:00.000Z',
  });

  const login = async (email: string, password?: string, role?: UserRole) => {
    try {
      const res = await api.login(email, password, role);
      setUser(res.user);
    } catch (err) {
      console.error('Login failed, fallback to simulated user', err);
      if (role === 'OWNER') {
        setUser({
          id: 'usr-2',
          name: 'Sunita Rao (Owner)',
          email: 'owner@glowbook.com',
          role: 'OWNER',
          phone: '+91 98450 11223',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          city: 'Bengaluru',
          parlorId: 'parlor-1',
          createdAt: '2025-11-15T08:30:00.000Z',
        });
      } else if (role === 'ADMIN') {
        setUser({
          id: 'usr-3',
          name: 'Kavita Patel (Admin)',
          email: 'admin@glowbook.com',
          role: 'ADMIN',
          phone: '+91 98800 99887',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
          city: 'Bengaluru',
          createdAt: '2025-08-01T09:00:00.000Z',
        });
      } else {
        setUser({
          id: 'usr-1',
          name: 'Ananya Sharma',
          email: email || 'customer@glowbook.com',
          role: 'CUSTOMER',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          city: 'Bengaluru',
          createdAt: '2026-01-10T10:00:00.000Z',
        });
      }
    }
  };

  const register = async (name: string, email: string, role: UserRole, phone?: string, city?: string) => {
    const res = await api.register({ name, email, role, phone, city });
    setUser(res.user);
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    if (targetRole === 'OWNER') {
      setUser({
        id: 'usr-2',
        name: 'Sunita Rao (Owner)',
        email: 'owner@glowbook.com',
        role: 'OWNER',
        phone: '+91 98450 11223',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        city: 'Bengaluru',
        parlorId: 'parlor-1',
        createdAt: '2025-11-15T08:30:00.000Z',
      });
    } else if (targetRole === 'ADMIN') {
      setUser({
        id: 'usr-3',
        name: 'Kavita Patel (Admin)',
        email: 'admin@glowbook.com',
        role: 'ADMIN',
        phone: '+91 98800 99887',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        city: 'Bengaluru',
        createdAt: '2025-08-01T09:00:00.000Z',
      });
    } else {
      setUser({
        id: 'usr-1',
        name: 'Ananya Sharma',
        email: 'customer@glowbook.com',
        role: 'CUSTOMER',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        city: 'Bengaluru',
        createdAt: '2026-01-10T10:00:00.000Z',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CUSTOMER',
        isAuthenticated: !!user,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
