import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleEntity } from 'src/entities/article.entity'
import { CategoryEntity } from 'src/entities/category.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleContentEntity)
    private readonly articleContentRepository: Repository<ArticleContentEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity | null> {
    try {
      console.log('DTO_CREATE_CATEGORY:', createCategoryDto)

      let category = this.categoryRepository.create(createCategoryDto)
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

  async remove(id: string): Promise<number> {
    try {
      let existedCategory = await this.categoryRepository.findOne({
        where: { id },
      })
      if (existedCategory) {
        let articles = await this.articleRepository.find({
          where: { category: { id: existedCategory.id } },
          relations: ['category'], // If you want to include the category details in the result
        })
        if (Array.isArray(articles) && articles.length > 0) {
          articles.forEach(async (article) => {
            let articleContents = await this.articleContentRepository.find({
              where: { article: { id: article.id } },
              relations: ['article'], // If you want to include the category details in the result
            })
            articleContents.forEach(async (content) => {
              await this.articleContentRepository.delete(content.id)
            })
            await this.articleRepository.delete(article.id)
          })
        }
        let result = await this.categoryRepository.delete(id)
        return result.affected
      } else return 0
    } catch (error) {
      console.log(error)
      return -1
    }
  }
}
