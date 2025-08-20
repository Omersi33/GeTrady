import { Module } from '@nestjs/common'
import { StrategyService } from "./strategy.service";
import { TwelveDataService } from '../twelvedata/twelvedata.service';
import { AssetsModule } from '../../assets/assets.module';

@Module({
  imports: [AssetsModule],
  providers: [TwelveDataService, StrategyService],
  exports  : [TwelveDataService, StrategyService]
})
export class IntegrationsModule {}