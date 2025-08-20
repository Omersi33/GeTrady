import { Injectable, BadRequestException } from '@nestjs/common'
import { TwelveDataService } from '../integrations/twelvedata/twelvedata.service'
import { StrategyService } from '../integrations/strategy/strategy.service'
import { AssetsService } from '../assets/assets.service'
import { AssetPayload } from '../assets/assets.types'
import { UsersService } from '../users/users.service'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class MarketService {
  constructor(
    private readonly td: TwelveDataService,
    private readonly strat: StrategyService,
    private readonly assets: AssetsService,
    private readonly users: UsersService,
    private readonly notif: NotificationsService
  ) {}

  private async getValidSpot(symbol: string): Promise<number> {
    try {
      const liveRaw = await this.td.fetchLivePrice(symbol)
      const live = Number(liveRaw)
      if (Number.isFinite(live)) return live
    } catch {}
    const closes = await this.td.getCloses(symbol, 3, 'DESC')
    for (const v of closes) {
      const n = Number(v)
      if (Number.isFinite(n)) return n
    }
    throw new BadRequestException('no valid price for ' + symbol)
  }

  async advise(symbol: string) {
    symbol = symbol.toUpperCase()

    const advice = await this.strat.getAdvice(symbol)
    const spot = await this.getValidSpot(symbol)

    const row = await this.assets.getAssetSignal(symbol).catch(() => null)
    const {
      maFast = 8,
      maSlow = 21,
      rsiLo = 15,
      rsiHi = 85,
      bbPeriod = 20,
      bbStdDev = 2
    } = (row as any) ?? {}

    let TP1 = 0, TP2 = 0, TP3 = 0, SL = 0
    if (advice === 'BUY') {
      TP1 = +(spot * 1.003).toFixed(2)
      TP2 = +(spot * 1.009).toFixed(2)
      TP3 = +(spot * 1.020).toFixed(2)
      SL = +(spot * 0.998).toFixed(2)
    } else if (advice === 'SELL') {
      TP1 = +(spot * 0.997).toFixed(2)
      TP2 = +(spot * 0.991).toFixed(2)
      TP3 = +(spot * 0.980).toFixed(2)
      SL = +(spot * 1.002).toFixed(2)
    }

    const payload: AssetPayload = {
      symbol,
      lastUpdate: new Date(),
      currentValue: spot,
      advice,
      TP1,
      TP2,
      TP3,
      SL,
      maFast,
      maSlow,
      rsiLo,
      rsiHi,
      bbPeriod,
      bbStdDev
    }
    await this.assets.upsert(payload)

    const lastAdvice = (row as any)?.advice ?? 'WAIT'
    if ((advice === 'BUY' || advice === 'SELL') && advice !== lastAdvice) {
      const tokens = await this.users.getAllPushTokens()
      if (tokens.length) {
        await this.notif.sendPush(
          tokens,
          `${symbol} : ${advice}`,
          `Signal ${advice} détecté à ${spot}`,
          { symbol, advice, price: spot }
        )
      }
    }

    return {
      date: payload.lastUpdate,
      currentValue: spot,
      advice,
      TP1,
      TP2,
      TP3,
      SL
    }
  }

  async getAssetSignal(symbol: string) {
    symbol = symbol.toUpperCase()
    const row = await this.assets.getAssetSignal(symbol)
    if (!row) throw new BadRequestException('no data for ' + symbol)
    return {
      date: row.lastUpdate,
      currentValue: row.currentValue,
      advice: row.advice,
      TP1: row.TP1,
      TP2: row.TP2,
      TP3: row.TP3,
      SL: row.SL,
      maFast: row.maFast,
      maSlow: row.maSlow,
      rsiLo: row.rsiLo,
      rsiHi: row.rsiHi,
      bbPeriod: row.bbPeriod,
      bbStdDev: row.bbStdDev
    }
  }

  async listAllAssets() {
    const rows = await this.assets.findAll()
    return rows.map(r => ({
      id: r.id,
      symbol: r.symbol,
      lastUpdate: r.lastUpdate,
      currentValue: r.currentValue,
      advice: r.advice,
      TP1: r.TP1,
      TP2: r.TP2,
      TP3: r.TP3,
      SL: r.SL,
      maFast: r.maFast,
      maSlow: r.maSlow,
      rsiLo: r.rsiLo,
      rsiHi: r.rsiHi,
      bbPeriod: r.bbPeriod,
      bbStdDev: r.bbStdDev
    }))
  }
}