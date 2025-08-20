import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'idUser' })
  id!: number

  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string

  @Column({ type: 'date', nullable: true })
  birth?: Date

  @Column({ type: 'varchar', length: 190, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 100 })
  password!: string

  @Column({ type: 'boolean', default: false, name: 'isAdmin' })
  isAdmin!: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  expoPushToken?: string
}