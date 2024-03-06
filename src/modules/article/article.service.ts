import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { join } from 'path'
import { CreateArticleDto, UpdateArticleDto } from 'src/dto/article.dto'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleEntity } from 'src/entities/article.entity'
import { generateRandomString } from 'src/utils/helpers/common.helpers'
import { Repository } from 'typeorm'
import * as fs from 'fs'
import { CategoryEntity } from 'src/entities/category.entity'

@Injectable()
export class ArticleService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleContentEntity)
    private readonly articleContentRepository: Repository<ArticleContentEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createArticleDto: CreateArticleDto, thumbnail: Express.Multer.File): Promise<ArticleEntity | null> {
    try {
      console.log(thumbnail)
      console.log(createArticleDto)

      let savedThumbnailName = `article_thumb_${createArticleDto.createTime.getTime()}_${generateRandomString(10)}.${
        thumbnail.originalname.split('.').reverse()[0]
      }`
      const folderPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'article')
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
      }
      let savedThumbnailPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'article', savedThumbnailName)
      try {
        fs.writeFileSync(savedThumbnailPath, thumbnail.buffer)
      } catch (error) {
        console.log('Error when saving image: ', error)
        return null
      }
      let article = this.articleRepository.create({ ...createArticleDto, thumbnail: savedThumbnailPath })
      return await this.articleRepository.save(article)
    } catch (error) {
      console.log('ERROR:', error)

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
      let articleList = await this.articleRepository.find({
        relations: ['category'],
        order: {
          publicTime: 'ASC',
        },
      })
      let newArticleList: ArticleEntity[] = []
      articleList.forEach((atc) => {
        let newArticle: ArticleEntity = {
          ...atc,
          thumbnail: `${this.configService.get('API_HOST')}/${atc.thumbnail}`,
        }
        newArticleList.push(newArticle)
      })
      return newArticleList
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

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    thumbnail: Express.Multer.File | undefined,
  ): Promise<ArticleEntity | undefined | null> {
    try {
      console.log('DTO_UPDATE_ARTICLE', updateArticleDto)

      let currentArticle = await this.articleRepository.findOne({ where: { id } })
      console.log('currentArticle', currentArticle)
      if (!currentArticle) {
        console.log('ERROR: CAN NOT FIND ARTICLE')
        return null
      }

      let updatedCategory = await this.categoryRepository.findOne({ where: { id: updateArticleDto.categoryId } })
      if (!updatedCategory) {
        console.log('ERROR: CAN NOT FIND CATEGORY WITH ID = ', updateArticleDto.categoryId)

        return null
      }

      let savedThumbnailPath = currentArticle.thumbnail

      if (thumbnail) {
        console.log('NEW THUMBNAIL', thumbnail)
        console.log('DUOI', thumbnail.originalname.split('.').reverse()[0])

        let updateTime = new Date()
        let savedThumbnailName = `article_thumb_${updateTime.getTime()}_${generateRandomString(10)}.${
          thumbnail.originalname.split('.').reverse()[0]
        }`
        savedThumbnailPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'article', savedThumbnailName)
        console.log('savedThumbnailPath', savedThumbnailPath)
        try {
          const folderPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'article')
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
          }
          fs.writeFileSync(savedThumbnailPath, thumbnail.buffer)
        } catch (error) {
          console.log('Error when saving image: ', error)
          return null
        }
        try {
          await fs.promises.unlink(currentArticle.thumbnail)
        } catch (error) {
          console.log('ERROR DELETE OLD THUMBNAIL:', error)
        }
      }

      let updatedArticle = {
        title: updateArticleDto.title,
        shortDescription: updateArticleDto.shortDescription,
        active: updateArticleDto.active === '1',
        thumbnail: savedThumbnailPath,
        createTime: currentArticle.createTime,
        createBy: currentArticle.createBy,
        publicTime: updateArticleDto.publicTime,
        hashtag: updateArticleDto.hashtag,
        category: updatedCategory,
      }
      await this.articleRepository.update(id, updatedArticle)
      return this.articleRepository.findOne({ where: { id } })
    } catch (error) {
      console.log('ERROR:', error)
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
        try {
          await fs.promises.unlink(article.thumbnail)
        } catch (error) {
          console.log('ERROR DELETE OLD THUMBNAIL:', error)
        }
        return result.affected
      } else return 0
    } catch (error) {
      return -1
    }
  }
}
