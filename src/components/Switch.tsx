import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group select-none">
      {label && <span className="text-sm font-bold text-gray-700">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={cn(
          "w-12 h-7 rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-gray-200"
        )} />
        <motion.div
          animate={{ x: checked ? 22 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </div>
    </label>
  );
}
