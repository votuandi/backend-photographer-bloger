export class CreateCategoryDto {
  readonly name: string
  readonly active: number
}

export class UpdateCategoryDto {
  readonly name: string
  readonly active: boolean
}
