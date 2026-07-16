import { cn } from '../lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            "w-6 h-6 rounded-full border-2 border-gray-200 bg-white transition-all peer-checked:border-blue-600 group-hover:border-blue-300",
            className
          )} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
        </div>
        {label && <span className="text-sm font-bold text-gray-700">{label}</span>}
      </label>
    );
  }
);
