import { cn } from '../lib/utils';

interface IndicatorProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export function Indicator({ variant = 'success', size = 'md', pulse = false, className }: IndicatorProps) {
  const variants = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn("rounded-full", variants[variant], sizes[size])} />
      {pulse && (
        <div className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-75",
          variants[variant]
        )} />
      )}
    </div>
  );
}
