import { Injectable } from '@nestjs/common'
import { EMA, RSI, BollingerBands } from 'technicalindicators'
import { TwelveDataService } from '../twelvedata/twelvedata.service'
import { AssetsService } from '../../assets/assets.service'

export interface Signal {
  index: number
  type: 'BUY' | 'SELL'
  price: number
}

interface StratCfg {
  maFast: number
  maSlow: number
  rsiLo: number
  rsiHi: number
  bbPeriod: number
  bbStdDev: number
}

const DEFAULT_CFG: StratCfg = {
  maFast: 6,
  maSlow: 15,
  rsiLo: 30,
  rsiHi: 70,
  bbPeriod: 20,
  bbStdDev: 2
}

@Injectable()
export class StrategyService {
  constructor(
    private readonly td: TwelveDataService,
    private readonly assets: AssetsService
  ) {}

  private crossUp(f: number[], s: number[], i: number) {
    return f[i] > s[i] && f[i - 1] <= s[i - 1]
  }

  private crossDown(f: number[], s: number[], i: number) {
    return f[i] < s[i] && f[i - 1] >= s[i - 1]
  }

  async generateSignals(sym: string): Promise<Signal[]> {
    const c = await this.td.getCloses(sym, 400)
    const row = await this.assets.getAssetSignal(sym.toUpperCase()).catch(() => null)
    const { maFast, maSlow, rsiHi } = { ...DEFAULT_CFG, ...(row as Partial<StratCfg>) }

    if (c.length < maSlow + 1) return []

    const f = EMA.calculate({ period: maFast, values: c })
    const s = EMA.calculate({ period: maSlow, values: c })
    const r = RSI.calculate({ period: 14, values: c })
    const off = c.length - f.length

    const sig: Signal[] = []
    for (let i = 1; i < f.length; i++) {
      const idx = i + off
      if (this.crossUp(f, s, i)) {
        sig.push({ index: idx, type: 'BUY', price: c[idx] })
      } else if (this.crossDown(f, s, i) && r[i] >= rsiHi) {
        sig.push({ index: idx, type: 'SELL', price: c[idx] })
      }
    }
    return sig
  }

  async getAdvice(sym: string): Promise<'BUY' | 'SELL' | 'WAIT'> {
    const c = await this.td.getCloses(sym, 400)
    if (c.length < 30) return 'WAIT'

    const row = await this.assets.getAssetSignal(sym.toUpperCase()).catch(() => null)
    const { maFast, maSlow, rsiLo, rsiHi, bbPeriod, bbStdDev } =
      { ...DEFAULT_CFG, ...(row as Partial<StratCfg>) }

    const fast = EMA.calculate({ period: maFast, values: c }).at(-1)!
    const slow = EMA.calculate({ period: maSlow, values: c }).at(-1)!
    const rsi = RSI.calculate({ period: 14, values: c }).at(-1)!
    const bb = BollingerBands.calculate({ period: bbPeriod, values: c, stdDev: bbStdDev }).at(-1)
    const price = c.at(-1)!

    const overBought = bb ? price > bb.upper : false
    const overSold = bb ? price < bb.lower : false

    if (fast > slow && !overBought && rsi <= rsiHi) return 'BUY'
    if (fast < slow && !overSold && rsi >= rsiHi) return 'SELL'
    return 'WAIT'
  }
}