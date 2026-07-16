import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: '-left-2 top-1/2 -translate-y-1/2 -translate-x-full',
    right: '-right-2 top-1/2 -translate-y-1/2 translate-x-full',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute z-[300] px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg whitespace-nowrap pointer-events-none shadow-xl",
              positions[position],
              className
            )}
          >
            {content}
            <div className={cn(
              "absolute w-2 h-2 bg-gray-900 rotate-45",
              position === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
              position === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
              position === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
              position === 'right' && "left-[-4px] top-1/2 -translate-y-1/2",
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
