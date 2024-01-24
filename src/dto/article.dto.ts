import { CreateCategoryDto } from './category.dto'

export class CreateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
}

export class UpdateArticleDto {
  readonly title: string
  readonly shortDescription: string
  readonly createTime: Date
  readonly createBy: string
  readonly category: CreateCategoryDto
}
