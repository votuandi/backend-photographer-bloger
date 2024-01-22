import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Category } from './category.entity'
import { ArticleContent } from './article-content.entity'

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ name: 'short_description' })
  shortDescription: string

  @Column({ name: 'create_time' })
  createTime: Date

  @Column({ name: 'create_by' })
  createBy: string

  @ManyToOne(() => Category, (category) => category.articles)
  category: Category

  @OneToMany(() => ArticleContent, (content) => content.article)
  contents: ArticleContent[]
}
