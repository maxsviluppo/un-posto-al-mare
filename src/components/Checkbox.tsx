import { cn } from '../lib/utils';
import { Check } from 'lucide-react';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group select-none">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            "w-6 h-6 rounded-lg border-2 border-gray-200 bg-white transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-300",
            className
          )} />
          <Check 
            size={16} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
          />
        </div>
        {label && <span className="text-sm font-bold text-gray-700">{label}</span>}
      </label>
    );
  }
);
