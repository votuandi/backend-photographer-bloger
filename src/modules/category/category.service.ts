import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto'
import { CategoryEntity } from 'src/entities/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity | null> {
    try {
      console.log('DTO_CREATE_CATEGORY:', createCategoryDto)

      const category = this.categoryRepository.create(createCategoryDto)
      return await this.categoryRepository.save(category)
    } catch (error) {
      console.log('ERROR_CREATE_CATEGORY:', error)

      return null
    }
  }

  async findAll(): Promise<CategoryEntity[] | null> {
    try {
      return await this.categoryRepository.find()
    } catch (error) {
      return null
    }
  }

  async findOne(id: string): Promise<CategoryEntity | undefined | null> {
    try {
      return await this.categoryRepository.findOne({ where: { id } })
    } catch (error) {
      return null
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity | null> {
    try {
      await this.categoryRepository.update(id, updateCategoryDto)
      return this.categoryRepository.findOne({ where: { id } })
    } catch (error) {
      return null
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.categoryRepository.delete(id)
      return true
    } catch (error) {
      return false
    }
  }
}
