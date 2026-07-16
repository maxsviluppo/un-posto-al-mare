import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface StatProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function Stat({ icon, label, value, trend, className }: StatProps) {
  return (
    <div className={cn("bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-bold",
            trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <motion.h4
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          {value}
        </motion.h4>
      </div>
    </div>
  );
}
