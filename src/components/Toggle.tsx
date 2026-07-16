import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label && <span className="text-sm font-bold text-gray-700">{label}</span>}
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
          enabled ? "bg-blue-600" : "bg-gray-200"
        )}
      >
        <motion.div
          animate={{ x: enabled ? 26 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-6 h-6 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
