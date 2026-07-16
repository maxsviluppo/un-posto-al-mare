import { cn } from '../lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full py-4 px-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400 min-h-[120px] resize-none',
            error && 'ring-2 ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);
