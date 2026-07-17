import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UmbrellaIcon } from './UmbrellaIcon';
import { BOOKING_CONFIG, ROW_PRICES } from '../lib/bookingConfig';

export interface UmbrellaConfigValues {
  adults: number;
  children: number;
  chairs: number;
  sunbeds: number;
}

interface UmbrellaConfigMenuProps {
  row: number;
  num: number;
  anchor: { top: number; left: number };
  values: UmbrellaConfigValues;
  isEditing: boolean;
  onChange: (values: UmbrellaConfigValues) => void;
  onConfirm: () => void;
  onRemove: () => void;
  onCancel: () => void;
}

function CounterField({
  label,
  hint,
  value,
  min,
  max,
  onDecrease,
  onIncrease,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/60">
      <div className="space-y-0.5">
        <div className="text-[10px] font-black uppercase text-gray-800 tracking-wider">{label}</div>
        <div className="text-[9px] text-gray-400 font-medium">{hint}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
        >
          -
        </button>
        <span className="w-6 text-center text-xs font-bold text-gray-800">{value}</span>
        <button
          type="button"
          onClick={onIncrease}
          className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function UmbrellaConfigMenu({
  row,
  num,
  anchor,
  values,
  isEditing,
  onChange,
  onConfirm,
  onRemove,
  onCancel,
}: UmbrellaConfigMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  const rowPrice = ROW_PRICES[row as keyof typeof ROW_PRICES]?.price ?? 0;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[60] w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border border-[#E9DFCB] bg-white shadow-2xl overflow-hidden"
        style={{ top: anchor.top, left: anchor.left }}
        id="umbrella-config-menu"
      >
        <div className="bg-[#FAF8F5] px-4 py-3 border-b border-[#F1E8D5] flex justify-between items-center">
          <div>
            <span className="text-[8px] font-black tracking-widest text-[#ad8f65] uppercase">
              Configurazione postazione
            </span>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
              <UmbrellaIcon size={13} /> Ombrellone #{num} ({row}ª Fila)
            </h3>
          </div>
          <span className="text-[10px] font-black text-[#ad8f65] uppercase bg-amber-50 border border-[#E9DFCB]/50 px-2 py-0.5 rounded">
            €{rowPrice}
          </span>
        </div>

        <div className="p-4 space-y-3 max-h-[55vh] overflow-y-auto">
          <CounterField
            label="Numero Adulti"
            hint={`Max ${BOOKING_CONFIG.maxAdults} persone per ombrellone`}
            value={values.adults}
            min={1}
            max={BOOKING_CONFIG.maxAdults}
            onDecrease={() => onChange({ ...values, adults: Math.max(1, values.adults - 1) })}
            onIncrease={() => onChange({ ...values, adults: Math.min(BOOKING_CONFIG.maxAdults, values.adults + 1) })}
          />
          <CounterField
            label="Numero Bambini"
            hint={`Max ${BOOKING_CONFIG.maxChildren} bambini per ombrellone`}
            value={values.children}
            min={0}
            max={BOOKING_CONFIG.maxChildren}
            onDecrease={() => onChange({ ...values, children: Math.max(0, values.children - 1) })}
            onIncrease={() => onChange({ ...values, children: Math.min(BOOKING_CONFIG.maxChildren, values.children + 1) })}
          />
          <CounterField
            label="Numero Sedie"
            hint={`Max ${BOOKING_CONFIG.maxChairs} pezzi per ombrellone`}
            value={values.chairs}
            min={0}
            max={BOOKING_CONFIG.maxChairs}
            onDecrease={() => onChange({ ...values, chairs: Math.max(0, values.chairs - 1) })}
            onIncrease={() => onChange({ ...values, chairs: Math.min(BOOKING_CONFIG.maxChairs, values.chairs + 1) })}
          />
          <CounterField
            label="Numero Lettini"
            hint={`Max ${BOOKING_CONFIG.maxSunbeds} pezzi per ombrellone`}
            value={values.sunbeds}
            min={0}
            max={BOOKING_CONFIG.maxSunbeds}
            onDecrease={() => onChange({ ...values, sunbeds: Math.max(0, values.sunbeds - 1) })}
            onIncrease={() => onChange({ ...values, sunbeds: Math.min(BOOKING_CONFIG.maxSunbeds, values.sunbeds + 1) })}
          />
        </div>

        <div className="bg-[#FAF8F5] px-4 py-3 border-t border-[#F1E8D5] flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annulla
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onRemove}
              className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Rimuovi
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-white bg-[#ad8f65] hover:bg-[#967b56] rounded-lg shadow-sm transition-colors"
          >
            {isEditing ? 'Salva' : 'Conferma'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
