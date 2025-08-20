import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TwelveDataService } from './twelvedata.service'

@Module({
  imports: [HttpModule],
  providers: [TwelveDataService],
  exports: [TwelveDataService]
})

export class TwelveDataModule {}