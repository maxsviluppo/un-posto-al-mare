import { cn } from '../lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-100 shadow-sm',
      elevated: 'bg-white shadow-md',
      outline: 'bg-transparent border border-gray-200',
      ghost: 'bg-gray-50/50 border-none',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl transition-all',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      />
    );
  }
);
