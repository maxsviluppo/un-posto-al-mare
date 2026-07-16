import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface TimelineItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: ReactNode;
  isLast?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 z-10">
              {item.icon || <div className="w-2 h-2 bg-blue-600 rounded-full" />}
            </div>
            {index < items.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-100 -my-2" />
            )}
          </div>
          <div className="pb-8 pt-1 flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-gray-900">{item.title}</h4>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.time}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
