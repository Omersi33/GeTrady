import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AssetEntity } from 'src/assets/asset.entity'
import { User } from 'src/users/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        entities: [AssetEntity, User],
        synchronize: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}