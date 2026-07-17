import { Link, NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { UmbrellaIcon } from './UmbrellaIcon';

export function Navbar() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isPrenotazioniSpiaggia = location.pathname === '/prenotazioni-spiaggia';
  const [isScrolled, setIsScrolled] = useState(false);
  const useTransparentNav = isPrenotazioniSpiaggia && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 border-b",
      useTransparentNav
        ? "bg-transparent text-white border-transparent"
        : "bg-white/95 backdrop-blur-md border-gray-100 text-gray-900 shadow-sm"
    )}>
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 md:px-8">
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

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "text-xs font-bold transition-colors uppercase tracking-widest",
                isActive ? "text-[#ad8f65]" : "text-gray-400 hover:text-gray-600"
              )
            }
          >
            Admin
          </NavLink>
        )}
      </div>
    </header>
  );
}
