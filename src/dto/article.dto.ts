import { CategoryEntity } from 'src/entities/category.entity'

export class CreateArticlePayloadDto {
  readonly title: string
  readonly shortDescription: string
  readonly createBy: string
  readonly publicTime?: Date
  readonly hashtag: string
  readonly categoryId: string
  readonly active: '0' | '1'
}

export class CreateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly publicTime: Date
  readonly hashtag: string
  readonly category: CategoryEntity
  readonly active: boolean
}

export class UpdateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly publicTime: Date
  readonly hashtag: string
  readonly categoryId: string
  readonly active: '0' | '1'
}
