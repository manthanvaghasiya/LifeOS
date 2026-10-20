// File: src/components/ui/ModalBottomSheet.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Haptics } from '../../utils/haptics';

/**
 * ModalBottomSheet Component
 * Mimics Flutter's showModalBottomSheet widget with swipe-down-to-dismiss gesture,
 * spring dampening, backdrop blur, and safe area inset protection.
 */
export const ModalBottomSheet = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  maxHeight = 'max-h-[85vh]',
}) => {
  // Lock document scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      Haptics.light();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              Haptics.light();
              onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
          />

          {/* Draggable Sheet Surface */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 340,
              mass: 0.85,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              // Flick down or pulled down past threshold -> dismiss
              if (info.offset.y > 100 || info.velocity.y > 550) {
                Haptics.light();
                onClose();
              }
            }}
            className={`w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-[28px] shadow-2xl flex flex-col ${maxHeight} relative z-10 overflow-hidden`}
            style={{
              paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)',
            }}
          >
            {/* Grab Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none">
              <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 pb-3 pt-1 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  {title && (
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => {
                      Haptics.light();
                      onClose();
                    }}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition-colors active:scale-90"
                    aria-label="Close bottom sheet"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 overflow-y-auto overscroll-contain flex-1 no-scrollbar [-webkit-overflow-scrolling:touch]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalBottomSheet;
