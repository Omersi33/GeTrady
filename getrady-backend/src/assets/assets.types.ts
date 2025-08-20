export interface AssetPayload {
  symbol: string
  lastUpdate: Date
  currentValue: number
  advice: 'WAIT' | 'BUY' | 'SELL'
  TP1: number
  TP2: number
  TP3: number
  SL: number
  maFast: number;
  maSlow: number;
  rsiLo: number;
  rsiHi: number;
  bbPeriod: number
  bbStdDev: number
}