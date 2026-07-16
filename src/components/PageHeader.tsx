import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-gray-900">{title}</h2>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
