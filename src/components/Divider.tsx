import { cn } from '../lib/utils';

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <hr className={cn("border-t border-gray-100 my-6", className)} />;
  }

  return (
    <div className={cn("relative flex items-center gap-4 my-8", className)}>
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}
