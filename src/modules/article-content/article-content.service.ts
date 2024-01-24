import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateArticleContentDto, UpdateArticleContentDto } from 'src/dto/article-content.dto'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ArticleContentService {
  constructor(
    @InjectRepository(ArticleContentEntity)
    private readonly articleContentRepository: Repository<ArticleContentEntity>,
  ) {}

  async create(createArticleContentDto: CreateArticleContentDto): Promise<ArticleContentEntity | null> {
    try {
      const articleContent = this.articleContentRepository.create(createArticleContentDto)
      return await this.articleContentRepository.save(articleContent)
    } catch (error) {
      return null
    }
  }

  async findAll(): Promise<ArticleContentEntity[] | null> {
    try {
      return await this.articleContentRepository.find({ relations: ['article'] })
    } catch (error) {
      return null
    }
  }

  async findOne(id: string): Promise<ArticleContentEntity | undefined | null> {
    try {
      return await this.articleContentRepository.findOne({
        where: { id },
        relations: ['article'],
      })
    } catch (error) {
      return null
    }
  }

  async update(
    id: string,
    updateArticleContentDto: UpdateArticleContentDto,
  ): Promise<ArticleContentEntity | undefined | null> {
    try {
      await this.articleContentRepository.update(id, updateArticleContentDto)
      return this.articleContentRepository.findOne({
        where: { id },
        relations: ['article'],
      })
    } catch (error) {
      return null
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.articleContentRepository.delete(id)
      return true
    } catch (error) {
      return false
    }
  }
}
