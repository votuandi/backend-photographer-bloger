import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('banner')
export class BannerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 512 })
  path: string

  @Column({ type: 'int' })
  index: number

  @Column({ type: 'varchar', length: 10 })
  device: string

  @Column({ type: 'timestamp', name: 'create_time' })
  createTime: Date
}
