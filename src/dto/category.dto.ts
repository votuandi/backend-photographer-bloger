export class CreateCategoryDto {
  readonly name: string
  readonly active: '0' | '1'
}

export class UpdateCategoryDto {
  readonly name: string
  readonly active: '0' | '1'
}
