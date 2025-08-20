import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TwelveDataService } from './twelvedata/twelvedata.service'
import { StrategyService }   from './strategy/strategy.service'
import { AssetsModule } from '../assets/assets.module'

@Module({
  imports: [HttpModule, AssetsModule],
  providers: [
    TwelveDataService,
    StrategyService
  ],
  exports: [
    TwelveDataService,
    StrategyService
  ]
})
export class IntegrationsModule {}