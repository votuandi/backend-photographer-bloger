import { CreateCategoryDto } from './category.dto'

export class CreateArticlePayloadDto {
  readonly title: string
  readonly shortDescription: string
  readonly createBy: string
  readonly categoryId: string
}

export class CreateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
}

export class UpdateArticlePayloadDto {
  readonly title: string
  readonly shortDescription: string
  readonly categoryId: string
}

export class UpdateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
}
