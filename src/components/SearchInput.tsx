import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Cerca...", className }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn(
      "relative group flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-3 transition-all",
      isFocused ? "ring-2 ring-blue-500 border-transparent shadow-lg" : "hover:border-gray-200 shadow-sm",
      className
    )}>
      <Search className={cn(
        "shrink-0 transition-colors",
        isFocused ? "text-blue-600" : "text-gray-400"
      )} size={20} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none focus:ring-0 px-3 py-0 text-sm font-medium placeholder:text-gray-400"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
