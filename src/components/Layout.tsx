import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

function MockStatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState('14:08');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`absolute top-0 left-0 right-0 h-11 px-8 flex justify-between items-center select-none text-[13px] font-semibold z-50 pointer-events-none ${dark ? 'text-white' : 'text-gray-900'}`}>
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <div className="flex items-end gap-[2px] h-[10px]">
          <span className={`w-[2px] h-1.5 rounded-full ${dark ? 'bg-white' : 'bg-gray-900'}`} />
          <span className={`w-[2px] h-2 rounded-full ${dark ? 'bg-white' : 'bg-gray-900'}`} />
          <span className={`w-[2px] h-2.5 rounded-full ${dark ? 'bg-white' : 'bg-gray-900'}`} />
          <span className={`w-[2px] h-3 rounded-full ${dark ? 'bg-white/40' : 'bg-gray-900/40'}`} />
        </div>
        {/* Wifi */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12.5a10.5 10.5 0 0 1 14 0" />
          <path d="M8.5 16a5.5 5.5 0 0 1 7 0" />
          <path d="M12 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="currentColor" />
        </svg>
        {/* Battery */}
        <div className={`w-[22px] h-[11px] rounded-[3px] border p-[1px] flex items-center relative ${dark ? 'border-white/70' : 'border-gray-900/70'}`}>
          <div className={`h-full w-4/5 rounded-[1px] ${dark ? 'bg-white' : 'bg-gray-900'}`} />
          <span className={`w-[1.5px] h-1 rounded-r-[1px] absolute -right-[2.5px] top-1/2 -translate-y-1/2 ${dark ? 'bg-white/70' : 'bg-gray-900/70'}`} />
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isBooking = location.pathname === '/booking';
  const isTemp = location.pathname === '/temp';

  return (
    <div className={cn(
      "text-gray-900 flex flex-col font-sans antialiased",
      isHome ? "h-[100dvh] overflow-hidden bg-transparent" : "min-h-screen bg-[#f4ecd8]"
    )}>
      
      {/* Header/Navbar */}
      {!isTemp && <Navbar />}

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 w-full relative",
        !isHome && "max-w-[1920px] mx-auto",
        (isHome || isBooking || isTemp) ? "pt-0" : "pt-[72px]",
        isHome && "overflow-hidden"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar (mobile) */}
      <div className="md:hidden">
        <BottomNav />
      </div>

    </div>
  );
}
