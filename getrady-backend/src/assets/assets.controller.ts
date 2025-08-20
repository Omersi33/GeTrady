import { Body, Controller, Delete, Get, Param, Post, Patch, BadRequestException } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetPayload } from './assets.types';

@Controller('assets')
export class AssetsController {
  constructor(private readonly svc: AssetsService) {}

  /* Alias POST /assets/add  */
  @Post('add')
  createAlias(@Body('symbol') s: string) {
    return this.create(s);
  }

  /* POST /assets  (existant) */
  @Post()
  async create(@Body() body: any) {
    let { symbol, maFast = 5, maSlow = 20, rsiLo = 30, rsiHi = 70, bbPeriod = 20, bbStdDev = 2 } = body;
    if (!symbol) throw new BadRequestException('symbol required');
    symbol = symbol.trim().toUpperCase();

    /* doublon ? */
    const exists = await this.svc.getAssetSignal(symbol);
    if (exists) {
      throw new BadRequestException('Cet actif est déjà présent en base de données.');
    }

    const payload: AssetPayload = {
      symbol,
      lastUpdate: new Date(),
      currentValue: 0,
      advice: 'WAIT',
      TP1: 0, TP2: 0, TP3: 0, SL: 0,
      maFast, maSlow, rsiLo, rsiHi,
      bbPeriod: +bbPeriod,
      bbStdDev: +bbStdDev
    };
    const saved = await this.svc.upsert(payload);
    return saved;
  }

  /* Alias DELETE /assets/delete/:id */
  @Delete('delete/:id')
  removeAlias(@Param('id') id: number) {
    return this.remove(id);
  }

  /* DELETE /assets/:id  (existant) */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.svc['repo'].delete(id);      // accès direct au repo
  }

  /* Liste brute (optionnel) */
  @Get()
  list() { return this.svc.findAll(); }

  /* PATCH /assets/:id/cfg */
  @Patch(':id/cfg')
  updateCfg(@Param('id') id:number, @Body() body:any){
    const { maFast, maSlow, rsiLo, rsiHi, bbPeriod, bbStdDev } = body;
    return this.svc.updateCfg(id, {
      maFast:+maFast,
      maSlow:+maSlow,
      rsiLo:+rsiLo,
      rsiHi:+rsiHi,
      ...(bbPeriod !== undefined ? { bbPeriod:+bbPeriod } : {}),
      ...(bbStdDev !== undefined ? { bbStdDev:+bbStdDev } : {})
    });
  }
}
