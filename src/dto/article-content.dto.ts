import { ArticleEntity } from 'src/entities/article.entity'

export class CreateArticleContentPayloadDto {
  readonly previous: string | null
  readonly type: string
  readonly content: string
  readonly width: string
  readonly articleId: string
}

export class CreateArticleContentDto {
  readonly previous: string | null
  readonly type: string
  readonly content: string
  readonly width: string
  readonly article: ArticleEntity
}

export class UpdateArticleContentPayloadDto {
  readonly previous: string
  readonly type: string
  readonly content: string
  readonly width: string
  readonly articleId: string
}

export class UpdateArticleContentDto {
  readonly previous: string | null
  readonly type: string
  readonly content: string
  readonly width: string
  readonly article: ArticleEntity
}
