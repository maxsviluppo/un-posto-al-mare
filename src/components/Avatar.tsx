import { cn } from '../lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-12 h-12 text-sm',
      lg: 'w-16 h-16 text-xl',
      xl: 'w-24 h-24 text-3xl',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden bg-blue-50 flex items-center justify-center font-bold text-blue-600 shrink-0',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
    );
  }
);
