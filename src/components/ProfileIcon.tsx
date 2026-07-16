import { cn } from '../lib/utils';

export const PROFILE_ICON_SRC = '/icona profilo.png';

interface ProfileIconProps {
  size?: number;
  className?: string;
  alt?: string;
  vibrate?: boolean;
  cartoon3d?: boolean;
}

export function ProfileIcon({
  size = 22,
  className = '',
  alt = 'Profilo',
  vibrate = false,
  cartoon3d = true,
}: ProfileIconProps) {
  return (
    <img
      src={PROFILE_ICON_SRC}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={cn(
        'object-contain',
        cartoon3d && 'profile-icon-cartoon',
        vibrate && 'profile-icon-vibrate',
        className
      )}
    />
  );
}
