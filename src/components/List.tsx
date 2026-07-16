import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface ListItemProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({ icon, title, description, action, onClick, className }: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors group",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            {icon}
          </div>
        )}
        <div className="space-y-0.5">
          <h4 className="font-bold text-gray-900">{title}</h4>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

interface ListProps {
  children: ReactNode;
  className?: string;
}

export function List({ children, className }: ListProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {children}
    </div>
  );
}
