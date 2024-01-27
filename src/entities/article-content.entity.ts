import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { ArticleEntity } from './article.entity'

@Entity('article_content')
export class ArticleContentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => ArticleEntity, (article) => article.contents)
  article: ArticleEntity

  @Column({ nullable: true })
  previous: string | null

  @Column()
  type: string

  @Column()
  content: string

  @Column()
  width: string
}
