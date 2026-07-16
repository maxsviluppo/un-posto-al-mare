import React, { useMemo, useState } from 'react';

export type UmbrellaStatus = 'free' | 'booked' | 'mine';

export interface BeachRowConfig {
  id: number;
  label: string;
  umbrellas: number;
  top: string;
}

const UMBRELLA_ICONS: Record<UmbrellaStatus, string> = {
  free: '/verde.png',
  booked: '/rosso.png',
  mine: '/blu.png',
};

const DEFAULT_ROWS: BeachRowConfig[] = [
  { id: 1, label: '1ª Fila — Fronte Mare', umbrellas: 10, top: '36%' },
  { id: 2, label: '2ª Fila — Centro Spiaggia', umbrellas: 10, top: '50%' },
  { id: 3, label: '3ª Fila — Retro Spiaggia', umbrellas: 10, top: '64%' },
];

const DEMO_BOOKED: Record<string, UmbrellaStatus> = {
  '1-2': 'booked',
  '1-5': 'booked',
  '1-8': 'booked',
  '2-1': 'booked',
  '2-4': 'booked',
  '2-7': 'booked',
  '2-10': 'booked',
  '3-3': 'booked',
  '3-6': 'booked',
};

function spotKey(row: number, num: number) {
  return `${row}-${num}`;
}

interface BeachUmbrellaMapProps {
  backgroundSrc?: string;
  rows?: BeachRowConfig[];
  umbrellaSize?: number;
  umbrellaGap?: number;
  bottomNavOffset?: boolean;
}

export function BeachUmbrellaMap({
  backgroundSrc = '/spiaggia%20sfondo.png',
  rows = DEFAULT_ROWS,
  umbrellaSize = 56,
  umbrellaGap = 28,
  bottomNavOffset = true,
}: BeachUmbrellaMapProps) {
  const [statuses, setStatuses] = useState<Record<string, UmbrellaStatus>>(() => {
    const initial: Record<string, UmbrellaStatus> = {};
    rows.forEach((row) => {
      for (let num = 1; num <= row.umbrellas; num += 1) {
        const key = spotKey(row.id, num);
        initial[key] = DEMO_BOOKED[key] ?? 'free';
      }
    });
    return initial;
  });

  const maxUmbrellas = useMemo(
    () => Math.max(...rows.map((row) => row.umbrellas), 10),
    [rows]
  );

  const umbrellasTrackWidth = maxUmbrellas * (umbrellaSize + umbrellaGap) + 96;
  const mapWidth = Math.max(umbrellasTrackWidth, 1500);

  const handleUmbrellaClick = (rowId: number, num: number) => {
    const key = spotKey(rowId, num);
    const current = statuses[key] ?? 'free';

    if (current === 'booked') return;

    setStatuses((prev) => ({
      ...prev,
      [key]: current === 'mine' ? 'free' : 'mine',
    }));
  };

  const viewportHeight = bottomNavOffset
    ? 'calc(100vh - 72px)'
    : '100vh';

  const backgroundStyle = {
    backgroundImage: `url(${backgroundSrc})`,
    backgroundRepeat: 'no-repeat' as const,
  };

  return (
    <div
      className="w-full overflow-x-auto overflow-y-hidden touch-pan-x"
      style={{ height: viewportHeight }}
      id="beach-map-scroll"
    >
      <div
        className="relative h-full select-none"
        style={{ width: mapWidth, minHeight: viewportHeight }}
        id="beach-map-canvas"
      >
        <div
          className="absolute top-0 left-0 w-full h-1/3 pointer-events-none"
          style={{
            ...backgroundStyle,
            backgroundSize: '100% 300%',
            backgroundPosition: 'center top',
          }}
          id="beach-sea-layer"
        />

        <div
          className="absolute top-1/3 left-0 w-full h-2/3 bg-[#ddb678] pointer-events-none"
          style={{
            ...backgroundStyle,
            backgroundSize: '100% 150%',
            backgroundPosition: 'center bottom',
          }}
          id="beach-sand-layer"
        />

        {rows.map((row) => (
          <div
            key={row.id}
            className="absolute left-0 z-10 flex items-center px-8"
            style={{
              top: row.top,
              gap: umbrellaGap,
              width: umbrellasTrackWidth,
            }}
            id={`beach-row-${row.id}`}
          >
            {Array.from({ length: row.umbrellas }, (_, index) => {
              const num = index + 1;
              const key = spotKey(row.id, num);
              const status = statuses[key] ?? 'free';

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleUmbrellaClick(row.id, num)}
                  disabled={status === 'booked'}
                  title={
                    status === 'booked'
                      ? `Ombrellone ${num} — Occupato`
                      : status === 'mine'
                      ? `Ombrellone ${num} — Selezionato`
                      : `Ombrellone ${num} — Libero`
                  }
                  className={`relative flex shrink-0 flex-col items-center justify-center transition-transform duration-150 ${
                    status === 'booked'
                      ? 'cursor-not-allowed opacity-95'
                      : 'cursor-pointer hover:scale-110 active:scale-95'
                  }`}
                  style={{ width: umbrellaSize, height: umbrellaSize + 18 }}
                  id={`umbrella-${row.id}-${num}`}
                >
                  <img
                    src={UMBRELLA_ICONS[status]}
                    alt=""
                    className="h-full w-full object-contain umbrella-icon-cartoon"
                    draggable={false}
                  />
                  <span className="absolute -bottom-0.5 rounded bg-white/70 px-1 text-[9px] font-black text-[#5c4323]">
                    {num}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
