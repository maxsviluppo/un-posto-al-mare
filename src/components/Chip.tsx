import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface ChipProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, icon, active = false, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border",
        active ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-gray-100 text-gray-500 hover:border-gray-200",
        className
      )}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <span>{label}</span>
    </button>
  );
}
