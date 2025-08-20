import { Module } from '@nestjs/common'
import { MarketController } from './market.controller'
import { MarketService } from './market.service'
import { AssetsModule } from '../assets/assets.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { MarketCronService } from './market-cron.service'
import { UsersModule } from '../users/users.module'
import { NotificationsModule } from '../notifications/notifications.module'

@Module({
  imports: [
    AssetsModule,
    IntegrationsModule,
    UsersModule,
    NotificationsModule
  ],
  controllers: [MarketController],
  providers: [MarketService, MarketCronService],
  exports: [MarketService, MarketCronService]
})

export class MarketModule {}