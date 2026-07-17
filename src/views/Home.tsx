import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { playClickSound } from '../lib/audio';

const PRESENT_IMAGE = '/sfondo titolo.png';
const PRENOTA_BUTTON_IMAGE = '/prenota1.png';

export function Home() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyMargin = body.style.margin;
    const prevBodyPadding = body.style.padding;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.margin = '0';
    body.style.padding = '0';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.margin = prevBodyMargin;
      body.style.padding = prevBodyPadding;
    };
  }, []);

  return (
    <div className="fixed inset-0 m-0 p-0 h-[100dvh] w-full overflow-hidden">
      <img
        src={PRESENT_IMAGE}
        alt="Un posto al mare"
        className="absolute inset-0 block h-full w-full object-cover object-center scale-[1.03]"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-10 px-6 pointer-events-none">
        <Link
          to="/prenotazioni-spiaggia"
          onClick={playClickSound}
          aria-label="Prenota ora"
          className="pointer-events-auto mb-[100px] transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <img
            src={PRENOTA_BUTTON_IMAGE}
            alt="Prenota"
            className="h-auto w-[min(46.5vw,169px)] object-contain profile-icon-cartoon"
            draggable={false}
          />
        </Link>
      </div>
    </div>
  );
}
