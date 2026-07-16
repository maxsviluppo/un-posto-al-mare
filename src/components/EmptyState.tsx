import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center space-y-6",
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 max-w-xs mx-auto">{description}</p>
      </div>
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}
