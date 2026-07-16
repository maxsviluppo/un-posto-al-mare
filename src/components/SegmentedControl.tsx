import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex p-1 bg-gray-100 rounded-2xl w-full", className)}>
      {options.map((option) => {
        const isActive = value === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 px-4 py-2.5 text-xs font-bold transition-colors rounded-xl",
              isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-active"
                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 uppercase tracking-widest">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
