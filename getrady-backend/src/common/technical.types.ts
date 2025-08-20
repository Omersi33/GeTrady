export type IntervalKey =
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '1h'
  | '4h'
  | '1day'

export interface IntervalMetrics {
  /* prix de clôture de la dernière bougie de l’intervalle */
  price: number

  /* indicateurs utilisés par la stratégie */
  ema9: number
  ema21: number
  atr14: number
  vwap: number
  hod: number
  lod: number
  rsi: number
  macd: number
  macdSignal: number

  /* infos annexes */
  volume24h: number
  change24h: number
  lastCloses?: number[]
}