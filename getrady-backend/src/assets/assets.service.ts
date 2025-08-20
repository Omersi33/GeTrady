// src/assets/assets.service.ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { AssetEntity } from './asset.entity'
import { AssetPayload } from './assets.types'

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly repo: Repository<AssetEntity>
  ) {}

  async upsert(data: AssetPayload): Promise<AssetEntity> {
    const existing = await this.repo.findOne({ where: { symbol: data.symbol } })

    if (existing) {
      // >>> on caste en DeepPartial pour satisfaire TypeORM
      this.repo.merge(existing, data as unknown as DeepPartial<AssetEntity>)
      return this.repo.save(existing)
    }

    return this.repo.save(
      this.repo.create(data as unknown as DeepPartial<AssetEntity>)
    )
  }

  async getAssetSignal(symbol: string): Promise<AssetEntity | null> {
    return this.repo.findOne({
      where : { symbol },
      order : { lastUpdate: 'DESC' }
    })
  }

  async findAll(): Promise<AssetEntity[]> {
    return this.repo.find({ order: { symbol: 'ASC' } })
  }

  async updateCfg(id: number, cfg: Partial<Pick<AssetEntity,'maFast'|'maSlow'|'rsiLo'|'rsiHi'|'bbPeriod'|'bbStdDev'>>){
    await this.repo.update(id, cfg)
    return { ok:true }
  }
}