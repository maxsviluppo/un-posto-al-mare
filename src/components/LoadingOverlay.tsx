import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = "Caricamento..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[500] flex flex-col items-center justify-center gap-6"
        >
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-blue-100 border-t-blue-600 rounded-full"
            />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
