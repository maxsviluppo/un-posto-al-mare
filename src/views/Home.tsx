import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playClickSound } from '../lib/audio';
import { UmbrellaIcon } from '../components/UmbrellaIcon';

const PRESENT_IMAGE = '/sfondo titolo.png';

export function Home() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-[100dvh] w-screen overflow-hidden">
      <img
        src={PRESENT_IMAGE}
        alt="Un posto al mare"
        className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-10 px-6 pointer-events-none">
        <Link
          to="/booking"
          onClick={playClickSound}
          className="pointer-events-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-none font-montserrat font-bold border-2 border-white/40 hover:bg-white/20 active:translate-y-[2px] shadow-2xl shadow-black/30 inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-75"
        >
          Prenota Ora <UmbrellaIcon size={16} className="mix-blend-screen" />
        </Link>
      </div>
    </div>
  );
}
