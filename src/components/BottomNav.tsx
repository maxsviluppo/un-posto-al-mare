import { Home, Calendar, Settings, HardHat } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { ProfileIcon } from './ProfileIcon';

export function BottomNav() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const linkClass = (isActive: boolean) =>
    cn(
      'flex flex-col items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest transition-colors',
      isHome
        ? (isActive ? 'text-white' : 'text-white/70 hover:text-white')
        : (isActive ? 'text-[#ad8f65]' : 'text-gray-400 hover:text-gray-600')
    );

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 px-4 py-3 pb-6 flex justify-between items-center z-50',
        isHome
          ? 'bg-transparent border-t border-transparent'
          : 'bg-white/85 backdrop-blur-lg border-t border-gray-100/60'
      )}
    >
      <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
        <Home size={20} className="stroke-[2.5]" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/booking" className={({ isActive }) => linkClass(isActive)}>
        <Calendar size={20} className="stroke-[2.5]" />
        <span>Prenota</span>
      </NavLink>
      <NavLink to="/temp" className={({ isActive }) => linkClass(isActive)}>
        <HardHat size={20} className="stroke-[2.5]" />
        <span>Temp</span>
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin" className={({ isActive }) => linkClass(isActive)}>
          <Settings size={20} className="stroke-[2.5]" />
          <span>Admin</span>
        </NavLink>
      )}
      <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
        <ProfileIcon size={24} vibrate />
        <span>Profilo</span>
      </NavLink>
    </nav>
  );
}
