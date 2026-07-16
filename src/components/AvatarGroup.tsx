import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  className?: string;
}

export function AvatarGroup({ children, max = 3, className }: AvatarGroupProps) {
  const avatars = Array.isArray(children) ? children : [children];
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn("flex -space-x-3", className)}>
      {visibleAvatars.map((avatar, i) => (
        <div key={i} className="ring-4 ring-white rounded-full">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-12 h-12 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-xs font-bold text-gray-500">
          +{remaining}
        </div>
      )}
    </div>
  );
}
