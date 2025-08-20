import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MarketService } from './market.service'
import { AssetsService } from '../assets/assets.service'

@Injectable()
export class MarketCronService {
  private readonly log = new Logger(MarketCronService.name)

  constructor(
    private readonly market: MarketService,
    private readonly assets: AssetsService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async tick() {
    const now = new Date()
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Paris',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]))
    const dayMap: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
    const day = dayMap[parts.weekday.toLowerCase()]
    const hour = Number(parts.hour)
    const minute = Number(parts.minute)

    const marketOpen =
      (day === 1 && hour >= 1) || // lundi dès 01h
      (day >= 2 && day <= 4) ||   // mardi à jeudi non-stop
      (day === 5 && hour < 23)    // vendredi jusqu'à 22:59

    if (!marketOpen) return

    const rows = await this.assets.findAll()
    const poolSize = 5
    for (let i = 0; i < rows.length; i += poolSize) {
      const chunk = rows.slice(i, i + poolSize)
      await Promise.allSettled(
        chunk.map(async ({ symbol }) => {
          const res = await this.market.advise(symbol)
          this.log.log(`${symbol} → ${JSON.stringify(res)}`)
        })
      )
    }
  }
}