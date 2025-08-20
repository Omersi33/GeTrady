import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AssetEntity } from './asset.entity'
import { AssetsService } from './assets.service'
import { AssetsController } from './assets.controller'

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  providers: [AssetsService],
  exports: [AssetsService],
  controllers: [AssetsController],
})

export class AssetsModule {}