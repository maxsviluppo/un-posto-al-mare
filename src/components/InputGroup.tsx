import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface InputGroupProps {
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function InputGroup({ leftAddon, rightAddon, children, className }: InputGroupProps) {
  return (
    <div className={cn("flex items-stretch w-full group", className)}>
      {leftAddon && (
        <div className="flex items-center justify-center px-4 bg-gray-100 border-r border-white rounded-l-2xl text-gray-400 group-focus-within:text-blue-600 transition-colors">
          {leftAddon}
        </div>
      )}
      <div className={cn(
        "flex-1",
        leftAddon && "ml-[-1px]",
        rightAddon && "mr-[-1px]"
      )}>
        {children}
      </div>
      {rightAddon && (
        <div className="flex items-center justify-center px-4 bg-gray-100 border-l border-white rounded-r-2xl text-gray-400 group-focus-within:text-blue-600 transition-colors">
          {rightAddon}
        </div>
      )}
    </div>
  );
}
