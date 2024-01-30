import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateArticleDto, UpdateArticleDto } from 'src/dto/article.dto'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleEntity } from 'src/entities/article.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleContentEntity)
    private readonly articleContentRepository: Repository<ArticleContentEntity>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity | null> {
    try {
      let article = this.articleRepository.create(createArticleDto)
      return await this.articleRepository.save(article)
    } catch (error) {
      return null
    }
  }

  async findByCategoryId(categoryId: string): Promise<ArticleEntity[]> {
    try {
      let articles = await this.articleRepository.find({
        where: { category: { id: categoryId } },
        relations: ['category'], // If you want to include the category details in the result
      })
      return articles
    } catch (error) {
      return null
    }
  }

  async findAll(): Promise<ArticleEntity[] | null> {
    try {
      return await this.articleRepository.find({ relations: ['category'] })
    } catch (error) {
      return null
    }
  }

  async findOne(id: string): Promise<ArticleEntity | undefined | null> {
    try {
      return await this.articleRepository.findOne({
        where: { id },
        relations: ['category'],
      })
    } catch (error) {
      return null
    }
  }

  async update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity | undefined | null> {
    try {
      await this.articleRepository.update(id, updateArticleDto)
      return this.articleRepository.findOne({
        where: { id },
        relations: ['category'],
      })
    } catch (error) {
      return null
    }
  }

  async remove(id: string): Promise<number> {
    try {
      let article = await this.articleRepository.findOne({
        where: { id },
        relations: ['category'],
      })
      if (article) {
        let articleContents = await this.articleContentRepository.find({
          where: { article: { id: id } },
          relations: ['article'], // If you want to include the category details in the result
        })
        articleContents.forEach(async (content) => {
          await this.articleContentRepository.delete(content.id)
        })
        let result = await this.articleRepository.delete(id)
        return result.affected
      } else return 0
    } catch (error) {
      return -1
    }
  }
}
