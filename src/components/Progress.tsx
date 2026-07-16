import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function Progress({ value, max = 100, color = 'bg-blue-600', className }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}
