export class CreateArticleContentDto {
  readonly index: number
  readonly type: string
  readonly content: string
  readonly width: string
}

export class UpdateArticleContentDto {
  readonly index: number
  readonly type: string
  readonly content: string
  readonly width: string
}
