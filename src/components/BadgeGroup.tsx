import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface BadgeGroupProps {
  children: ReactNode;
  className?: string;
}

export function BadgeGroup({ children, className }: BadgeGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}
