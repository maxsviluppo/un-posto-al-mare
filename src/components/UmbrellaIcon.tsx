import { cn } from '../lib/utils';

export const UMBRELLA_ICON_SRC = '/icona ombrellone bianca.png';

interface UmbrellaIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function UmbrellaIcon({ size = 22, className = '', alt = '' }: UmbrellaIconProps) {
  return (
    <img
      src={UMBRELLA_ICON_SRC}
      alt={alt}
      width={size}
      height={size}
      className={cn('object-contain', className)}
      draggable={false}
    />
  );
}
