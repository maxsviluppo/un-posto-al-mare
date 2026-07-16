import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '../lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', isOpen, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, duration]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-6 right-6 md:left-auto md:right-8 md:bottom-8 z-[200] pointer-events-none"
        >
          <div className={cn(
            "max-w-md ml-auto bg-white rounded-2xl shadow-2xl p-4 border flex items-center gap-4 pointer-events-auto",
            type === 'success' ? "border-green-100" : "border-red-100"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              type === 'success' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              {type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <p className="flex-1 text-sm font-bold text-gray-700">{message}</p>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
