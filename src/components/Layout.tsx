import { Outlet, useLocation } from 'react-router-dom';
import { AppNav } from './AppNav';
import { Navbar } from './Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isPrenotazioniSpiaggia = location.pathname === '/prenotazioni-spiaggia';

  return (
    <div className={cn(
      "text-gray-900 flex flex-col font-sans antialiased",
      isHome ? "h-[100dvh] overflow-hidden bg-transparent" : "min-h-screen bg-[#f4ecd8]"
    )}>
      {!isHome && !isPrenotazioniSpiaggia && <Navbar />}

      <main className={cn(
        "relative",
        isHome
          ? "fixed inset-0 z-0 m-0 p-0 h-[100dvh] w-full overflow-hidden"
          : cn(
              "flex-1 w-full max-w-[1920px] mx-auto",
              isPrenotazioniSpiaggia ? "pt-0" : "pt-[72px]"
            )
      )}>
        {isHome ? (
          <Outlet />
        ) : (
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
        )}
      </main>

      <AppNav />
    </div>
  );
}
