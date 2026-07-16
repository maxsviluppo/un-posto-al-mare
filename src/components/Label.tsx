import { cn } from '../lib/utils';
import { LabelHTMLAttributes, forwardRef } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1',
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-red-500">*</span>}
      </label>
    );
  }
);
