import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Article } from './article.entity'

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50 })
  name: string

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}
