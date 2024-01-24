import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { CategoryEntity } from './category.entity'
import { ArticleContentEntity } from './article-content.entity'

@Entity('article')
export class ArticleEntity {
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

  @ManyToOne(() => CategoryEntity, (category) => category.articles)
  category: CategoryEntity

  @OneToMany(() => ArticleContentEntity, (content) => content.article)
  contents: ArticleContentEntity[]
}
