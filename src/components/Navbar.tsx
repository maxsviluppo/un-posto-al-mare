import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { UmbrellaIcon } from './UmbrellaIcon';
import { ProfileIcon } from './ProfileIcon';

export function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isBooking = location.pathname === '/booking';
  const isTemp = location.pathname === '/temp';
  const [isScrolled, setIsScrolled] = useState(false);
  const useTransparentNav = isHome || ((isBooking || isTemp) && !isScrolled);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]); // re-bind or re-check when path changes

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 border-b",
      useTransparentNav
        ? "bg-transparent text-white border-transparent"
        : "bg-white/95 backdrop-blur-md border-gray-100 text-gray-900 shadow-sm"
    )}>
      <div className={cn(
        "max-w-[1920px] mx-auto flex items-center px-4 md:px-8",
        isHome ? "justify-end" : "justify-between"
      )}>
        {!isHome && (
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 bg-transparent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              id="navbar-logo-icon"
            >
              <UmbrellaIcon size={22} alt="Lido" className="mix-blend-screen" />
            </div>
            <span className={cn(
              "text-lg font-sans font-extrabold tracking-[0.18em] uppercase transition-colors duration-300",
              useTransparentNav ? "text-white" : "text-gray-900"
            )}>
              Lido
            </span>
          </Link>
        )}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "text-xs font-bold transition-colors uppercase tracking-widest",
                useTransparentNav
                  ? (isActive ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white")
                  : (isActive ? "text-[#ad8f65]" : "text-gray-400 hover:text-gray-600")
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/booking"
            className={({ isActive }) =>
              cn(
                "text-xs font-bold transition-colors uppercase tracking-widest",
                useTransparentNav
                  ? (isActive ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white")
                  : (isActive ? "text-[#ad8f65]" : "text-gray-400 hover:text-gray-600")
              )
            }
          >
            Prenota
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "text-xs font-bold transition-colors uppercase tracking-widest",
                  useTransparentNav
                    ? (isActive ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white")
                    : (isActive ? "text-[#ad8f65]" : "text-gray-400 hover:text-gray-600")
                )
              }
            >
              Admin
            </NavLink>
          )}
        </div>
        <Link
          to="/profile"
          aria-label={user ? `Profilo di ${user.email?.split('@')[0]}` : 'Profilo'}
          className={cn(
            "flex items-center gap-2 rounded-xl transition-all hover:scale-105",
            useTransparentNav
              ? "text-white"
              : "text-gray-900"
          )}
        >
          <ProfileIcon size={34} vibrate />
          <span className="hidden md:inline text-xs font-black uppercase tracking-widest">
            {user ? user.email?.split('@')[0] : 'Profilo'}
          </span>
        </Link>
      </div>
    </header>
  );
}
