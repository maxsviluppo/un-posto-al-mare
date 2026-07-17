export const ROW_PRICES = {
  1: { name: '1ª Fila - Fronte Mare', price: 35 },
  2: { name: '2ª Fila - Centro Spiaggia', price: 25 },
  3: { name: '3ª Fila - Retro Spiaggia', price: 20 },
} as const;

export const BOOKING_CONFIG = {
  maxAdults: 4,
  maxChildren: 4,
  maxChairs: 2,
  maxSunbeds: 2,
} as const;

export interface UmbrellaSelection {
  row: number;
  num: number;
  adults: number;
  children: number;
  chairs: number;
  sunbeds: number;
}

export const DEFAULT_UMBRELLA_SELECTION = {
  adults: 2,
  children: 0,
  chairs: 0,
  sunbeds: 2,
} as const;
