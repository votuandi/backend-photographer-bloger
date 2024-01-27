import { CreateArticleDto } from './article.dto'

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
  readonly article: CreateArticleDto
}

export class UpdateArticleContentPayloadDto {
  readonly previous: string | null
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
  readonly article: CreateArticleDto
}
