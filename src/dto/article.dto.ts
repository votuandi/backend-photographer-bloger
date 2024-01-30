import { CreateCategoryDto } from './category.dto'

export class CreateArticlePayloadDto {
  readonly title: string
  readonly shortDescription: string
  readonly createBy: string
  readonly categoryId: string
  readonly active: boolean
}

export class CreateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
  readonly active: boolean
}

export class UpdateArticlePayloadDto {
  readonly title: string
  readonly shortDescription: string
  readonly categoryId: string
  readonly active: boolean
}

export class UpdateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
  readonly active: boolean
}
