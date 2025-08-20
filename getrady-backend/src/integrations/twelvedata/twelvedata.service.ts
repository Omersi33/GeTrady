import { Injectable, BadRequestException, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { RSI, EMA } from 'technicalindicators'
import { IntervalKey, IntervalMetrics } from '../../common/technical.types'
import * as WebSocket from 'ws'

interface Candle {
  open: number
  high: number
  low: number
  close: number
  volume: number
}

@Injectable()
export class TwelveDataService implements OnModuleDestroy {
  private readonly apiKey: string
  private readonly timezone: string
  private readonly keys: IntervalKey[] = ['5min', '15min', '30min', '1h', '4h', '1day']
  private readonly wsMap = new Map<string, WebSocket>()
  private readonly spotMap = new Map<string, number>()
  private readonly cryptoWsWhitelist = new Set(['BTC/USD', 'ETH/USD', 'SOL/USD'])

  constructor(cfg: ConfigService, private readonly http: HttpService) {
    this.apiKey = cfg.get<string>('TWELVEDATA_API_KEY', '')!
    this.timezone = cfg.get<string>('TWELVEDATA_TZ', 'UTC')
  }

  onModuleDestroy() {
    for (const ws of this.wsMap.values()) ws.close()
  }

  private async getCandles(
    symbol: string,
    interval: string,
    limit = 200,
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Candle[]> {
    const { data } = await firstValueFrom(
      this.http.get('https://api.twelvedata.com/time_series', {
        params: { symbol, interval, outputsize: limit, order, timezone: this.timezone, apikey: this.apiKey }
      })
    )
    if (!data?.values?.length) throw new BadRequestException('no data for ' + symbol)
    return data.values.map((v: any) => ({
      open: +v.open,
      high: +v.high,
      low: +v.low,
      close: +v.close,
      volume: +v.volume
    })) as Candle[]
  }

  async fetchMetrics(symbol: string, interval: IntervalKey, limit = 200): Promise<IntervalMetrics> {
    const candles = await this.getCandles(symbol, interval, limit)
    const closes = candles.map(c => c.close)
    const rsiArr = RSI.calculate({ values: closes, period: 14 })
    const ema9 = EMA.calculate({ period: 9, values: closes }).at(-1) ?? 0
    const ema21 = EMA.calculate({ period: 21, values: closes }).at(-1) ?? 0
    const price = closes.at(-1)!
    return {
      price,
      volume24h: candles.slice(-288).reduce((s, c) => s + c.volume, 0),
      change24h: 0,
      rsi: rsiArr.at(-1) ?? 0,
      macd: 0,
      macdSignal: 0,
      ema9,
      ema21,
      atr14: 0,
      vwap: 0,
      hod: Math.max(...candles.map(c => c.high)),
      lod: Math.min(...candles.map(c => c.low))
    } as IntervalMetrics
  }

  async fetchAll(symbol: string) {
    const pairs = await Promise.all(this.keys.map(async k => [k, await this.fetchMetrics(symbol, k)] as const))
    const all = Object.fromEntries(pairs) as Record<IntervalKey, IntervalMetrics>
    const last5 = await this.getCandles(symbol, '5min', 5)
    all['5min'].lastCloses = last5.map(c => c.close)
    return all
  }

  async getCloses(symbol: string, limit = 300, order: 'ASC' | 'DESC' = 'ASC') {
    const candles = await this.getCandles(symbol, '1min', limit, order)
    return candles.map(c => c.close)
  }

  private ensureWs(symbol: string) {
    if (this.wsMap.has(symbol)) return
    const bin = symbol.replace('/', '').toLowerCase() + 't'
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${bin}@trade`)
    ws.on('message', msg => {
      try {
        const d = JSON.parse(msg.toString())
        if (d?.p) this.spotMap.set(symbol, +d.p)
      } catch {}
    })
    ws.on('close', () => this.wsMap.delete(symbol))
    this.wsMap.set(symbol, ws)
  }

  async fetchLivePrice(symbol: string): Promise<number> {
    if (this.cryptoWsWhitelist.has(symbol)) {
      this.ensureWs(symbol)
      const val = this.spotMap.get(symbol)
      if (val) return val
    }
    const { data } = await firstValueFrom(
      this.http.get('https://api.twelvedata.com/price', {
        params: { symbol, timezone: this.timezone, apikey: this.apiKey }
      })
    )
    if (data?.price) return +data.price
    const latest = await this.getCandles(symbol, '1min', 1, 'DESC')
    if (latest.length) return latest[0].close
    throw new BadRequestException('live price unavailable for ' + symbol)
  }
}