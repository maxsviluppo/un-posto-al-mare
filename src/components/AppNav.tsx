import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: '/home.png' },
  { to: '/prenotazioni-spiaggia', label: 'Prenota', icon: '/prenota1.png?v=2' },
  { to: '/profile', label: 'Profilo', icon: '/profilo.png' },
] as const;

export function AppNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end gap-6 sm:gap-10 px-6 pb-5 pt-2 pointer-events-none"
      aria-label="Navigazione principale"
      id="app-nav"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={item.label}
          title={item.label}
          className={({ isActive }) =>
            cn(
              'pointer-events-auto flex flex-col items-center gap-1 transition-transform duration-150 hover:scale-105 active:scale-95',
              isActive && 'scale-105'
            )
          }
        >
          {({ isActive }) => (
            <>
              <img
                src={item.icon}
                alt=""
                width={52}
                height={52}
                draggable={false}
                className={cn(
                  'h-12 w-12 sm:h-14 sm:w-14 object-contain profile-icon-cartoon',
                  isHome && 'drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]',
                  isActive && 'ring-2 ring-[#ad8f65]/80 ring-offset-2 ring-offset-transparent rounded-2xl'
                )}
              />
              <span
                className={cn(
                  'text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest',
                  isHome ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]' : 'text-[#5c4323]',
                  isActive && (isHome ? 'text-white' : 'text-[#ad8f65]')
                )}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
