import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  onRemove?: () => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', onRemove, children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-600',
      primary: 'bg-blue-50 text-blue-600',
      secondary: 'bg-blue-600 text-white',
      outline: 'bg-white border border-gray-200 text-gray-600',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="p-0.5 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </span>
    );
  }
);
