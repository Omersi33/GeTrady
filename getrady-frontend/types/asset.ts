export interface Asset {
  id: number;
  symbol: string;
  lastUpdate: string;
  currentValue: number;
  advice: string;
  TP1: number;
  TP2: number;
  TP3: number;
  SL:  number;
  maFast: number;
  maSlow: number;
  rsiLo: number;
  rsiHi: number;
  bbPeriod: number;
  bbStdDev: number;
}