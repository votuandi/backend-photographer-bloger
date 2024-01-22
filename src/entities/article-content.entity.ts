import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Article } from './article.entity'

@Entity('article_content')
export class ArticleContent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Article, (article) => article.contents)
  article: Article

  @Column()
  index: number

  @Column()
  type: string

  @Column()
  content: string

  @Column()
  width: string
}
