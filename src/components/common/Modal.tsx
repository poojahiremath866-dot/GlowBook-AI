import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const maxWClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`inline-block w-full ${maxWClasses[maxWidth]} my-8 text-left align-middle transition-all transform bg-[#FDFBF7] shadow-xl rounded-3xl border border-[#EAE2D8] overflow-hidden relative z-10`}
            >
              {/* Header */}
              {(title || subtitle) && (
                <div className="px-6 py-5 border-b border-[#EAE2D8] flex items-center justify-between bg-[#FAF7F2]">
                  <div>
                    {typeof title === 'string' ? (
                      <h3 className="text-xl font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
                        {title}
                      </h3>
                    ) : (
                      title
                    )}
                    {subtitle && (
                      <p className="text-xs text-[#5C5C5C] mt-0.5">{subtitle}</p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#5C5C5C] hover:text-[#1A1A1A] p-1.5 rounded-full hover:bg-[#F2E8E8] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {!title && !subtitle && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 text-[#5C5C5C] hover:text-[#1A1A1A] p-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F2E8E8] border border-[#EAE2D8] transition-colors shadow-xs cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Body */}
              <div className="max-h-[82vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
