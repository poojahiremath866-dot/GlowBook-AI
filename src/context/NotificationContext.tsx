import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'ai';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: 'success' | 'error' | 'info' | 'ai', title: string, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-welcome',
      type: 'ai',
      title: '✨ Welcome to GlowBook AI',
      message: 'Explore top luxury parlors, personalized beauty consultations, and easy instant booking.',
      duration: 6000
    }
  ]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showNotification = (
    type: 'success' | 'error' | 'info' | 'ai',
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const newNotif: Notification = { id, type, title, message, duration };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md flex items-start space-x-3 text-stone-900 ${
                n.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-200'
                  : n.type === 'error'
                  ? 'bg-rose-50/95 border-rose-200'
                  : n.type === 'ai'
                  ? 'bg-gradient-to-r from-rose-50/95 via-pink-50/95 to-amber-50/95 border-rose-200'
                  : 'bg-white/95 border-stone-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {n.type === 'ai' && <Sparkles className="w-5 h-5 text-rose-600 animate-pulse" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-stone-600" />}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-semibold text-stone-900 leading-tight">{n.title}</h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="text-stone-400 hover:text-stone-600 p-0.5 rounded-md hover:bg-black/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
