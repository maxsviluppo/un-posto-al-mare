import { cn } from '../lib/utils';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BannerProps {
  title: string;
  description: string;
  icon?: ReactNode;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  onClose?: () => void;
  className?: string;
}

export function Banner({ title, description, icon, variant = 'info', onClose, className }: BannerProps) {
  const variants = {
    info: 'bg-blue-50 border-blue-100 text-blue-800',
    warning: 'bg-amber-50 border-amber-100 text-amber-800',
    danger: 'bg-red-50 border-red-100 text-red-800',
    success: 'bg-green-50 border-green-100 text-green-800',
  };

  return (
    <div className={cn(
      "relative p-6 rounded-3xl border flex gap-4 transition-all",
      variants[variant],
      className
    )}>
      {icon && (
        <div className="shrink-0 w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div className="space-y-1 flex-1">
        <h4 className="font-bold text-sm uppercase tracking-wider">{title}</h4>
        <p className="text-sm opacity-80 leading-relaxed">{description}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors shrink-0 h-fit"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
