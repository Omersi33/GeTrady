// src/assets/asset.entity.ts
import { LargeNumberLike } from 'crypto'
import { numberTransformer } from 'src/infrastructure/database/number.transformer'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('asset')
export class AssetEntity {
  @PrimaryGeneratedColumn({ name: 'idAsset' })
  id!: number

  @Column({ length: 20 })
  symbol!: string

  @Column({ type: 'datetime', nullable: true })
  lastUpdate!: Date | null

  @Column({ type: 'decimal', precision: 20, scale: 2, transformer: numberTransformer, nullable: true })
  currentValue!: number | null

  @Column({ type: 'enum', enum: ['WAIT', 'BUY', 'SELL'], default: 'WAIT' })
  advice!: 'WAIT' | 'BUY' | 'SELL'

  @Column({ type: 'decimal', precision: 20, scale: 2, transformer: numberTransformer, nullable: true })
  TP1!: number | null

  @Column({ type: 'decimal', precision: 20, scale: 2, transformer: numberTransformer, nullable: true })
  TP2!: number | null

  @Column({ type: 'decimal', precision: 20, scale: 2, transformer: numberTransformer, nullable: true })
  TP3!: number | null

  @Column({ type: 'decimal', precision: 20, scale: 2, transformer: numberTransformer, nullable: true })
  SL!: number | null

  @Column({ type: 'int', default: 5  })
  maFast!: number

  @Column({ type: 'int', default: 20 })
  maSlow!: number

  @Column({ type: 'int', default: 30 })
  rsiLo!: number

  @Column({ type: 'int', default: 70 })
  rsiHi!: number

  @Column('int', { default: 20 })
  bbPeriod: number

  @Column('float', { default: 2 })
  bbStdDev: number
}