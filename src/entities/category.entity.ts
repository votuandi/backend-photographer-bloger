import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ArticleEntity } from './article.entity'

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'boolean', default: true })
  active: boolean

  @OneToMany(() => ArticleEntity, (article) => article.category)
  articles: ArticleEntity[]
}
