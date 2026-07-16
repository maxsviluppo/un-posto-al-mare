import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface HelperTextProps {
  children: ReactNode;
  variant?: 'default' | 'error' | 'success';
  className?: string;
}

export function HelperText({ children, variant = 'default', className }: HelperTextProps) {
  const variants = {
    default: 'text-gray-400',
    error: 'text-red-500',
    success: 'text-green-500',
  };

  return (
    <p className={cn("text-[10px] font-bold uppercase tracking-widest ml-1 mt-1.5", variants[variant], className)}>
      {children}
    </p>
  );
}
