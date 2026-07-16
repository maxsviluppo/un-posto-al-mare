import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readonly?: boolean;
  className?: string;
}

export function Rating({ value, onChange, max = 5, readonly = false, className }: RatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className={cn("flex gap-1", className)}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = (hover || value) >= starValue;
        
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHover(starValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            onClick={() => !readonly && onChange?.(starValue)}
            className={cn(
              "p-1 transition-all",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95",
              isFilled ? "text-amber-400" : "text-gray-200"
            )}
          >
            <Star 
              size={20} 
              fill={isFilled ? "currentColor" : "none"} 
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}
