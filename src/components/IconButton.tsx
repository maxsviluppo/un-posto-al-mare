import { cn } from '../lib/utils';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = 'ghost', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200',
      secondary: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      outline: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
      ghost: 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    };

    const sizes = {
      sm: 'p-1.5 rounded-lg',
      md: 'p-2.5 rounded-xl',
      lg: 'p-4 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all active:scale-[0.95] disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
