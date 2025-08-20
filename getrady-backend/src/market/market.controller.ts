import { Controller, Get, Query, BadRequestException, UseGuards } from '@nestjs/common'
import { MarketService } from './market.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('market')
export class MarketController {
  constructor(private readonly market: MarketService) {}

  @Get('asset')
  async getAssetSignal(@Query('symbol') symbol?: string) {
    if (!symbol) {
      throw new BadRequestException('query param "symbol" required, e.g. ?symbol=BTC/USD')
    }
    return this.market.getAssetSignal(symbol)
  }

  @Get('advise')
  async quote(@Query('symbol') symbol: string) {
    return this.market.advise(symbol)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('assets')
  findAssets() {
    return this.market.listAllAssets();
  }
}