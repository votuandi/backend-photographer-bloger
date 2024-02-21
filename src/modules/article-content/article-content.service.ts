import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { join } from 'path'
import {
  CreateArticleContentDto,
  UpdateArticleContentDto,
  UpdateArticleContentPayloadDto,
} from 'src/dto/article-content.dto'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { generateRandomString } from 'src/utils/helpers/common.helpers'
import { IsNull, Repository } from 'typeorm'
import * as fs from 'fs'
import { ArticleEntity } from 'src/entities/article.entity'

@Injectable()
export class ArticleContentService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ArticleContentEntity)
    private readonly articleContentRepository: Repository<ArticleContentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async create(
    createArticleContentDto: CreateArticleContentDto,
    image: Express.Multer.File | undefined,
  ): Promise<ArticleContentEntity | null> {
    try {
      console.log('\n----------------------')
      console.log('new Data:', createArticleContentDto)
      if (createArticleContentDto.type === 'image') {
        if (!image) return null
        let now = new Date()
        let savedThumbnailName = `article_content_${now.getTime()}_${generateRandomString(10)}.${
          image.originalname.split('.').reverse()[0]
        }`
        let savedThumbnailPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'article', savedThumbnailName)
        try {
          fs.writeFileSync(savedThumbnailPath, image.buffer)
        } catch (error) {
          console.log('Error when saving image: ', error)
          return null
        }
        createArticleContentDto = {
          ...createArticleContentDto,
          content: savedThumbnailPath,
        }
      }

      // Case previous is a content
      if (createArticleContentDto.previous) {
        console.log('Case previous is a content')

        // Find previous content
        let previousContent = await this.articleContentRepository.findOne({
          where: { id: createArticleContentDto.previous, article: createArticleContentDto.article },
          relations: ['article'],
        })

        // Case previous content is existed
        // -> Find current next content of previous content
        // -> If it is not existed -> Create
        // -> If it is existed
        // -> Create new next content of previous content
        // -> Edit old next content of previous content -> nextContent of new content
        if (previousContent) {
          // Case previous content is existed
          console.log('Case previous content is existed')
          let currentNextOfPreviousContent = await this.articleContentRepository.findOne({
            where: { previous: previousContent.id, article: createArticleContentDto.article },
            relations: ['article'],
          })
          if (currentNextOfPreviousContent) {
            // Case current next content of previous content is existed
            console.log('Case current next content of previous content is existed')

            let newArticleContent = this.articleContentRepository.create(createArticleContentDto)
            let savedNewArticleContent = await this.articleContentRepository.save(newArticleContent)

            try {
              let oldNext: UpdateArticleContentDto = {
                previous: newArticleContent.id,
                type: currentNextOfPreviousContent.type,
                content: currentNextOfPreviousContent.content,
                width: currentNextOfPreviousContent.width,
                article: currentNextOfPreviousContent.article,
              }
              await this.articleContentRepository.update(currentNextOfPreviousContent.id, oldNext)
            } catch (error) {
              return null
            }

            return savedNewArticleContent
          } else {
            // Case current next content of previous content is not existed
            console.log('Case THE LAST CONTENT')

            let newArticleContent = this.articleContentRepository.create(createArticleContentDto)
            return await this.articleContentRepository.save(newArticleContent)
          }
        } else {
          // Case previous content isn't existed
          console.log("Case previous content isn't existed")

          return null
        }
      } else {
        // Case previous is null (root)
        console.log('Case previous is null (root)')
        let oldRootContent = await this.articleContentRepository.findOne({
          where: { previous: IsNull(), article: createArticleContentDto.article },
          relations: ['article'],
        })
        console.log('Find current root', oldRootContent)

        if (oldRootContent) {
          if (oldRootContent.previous) return null
          console.log('Case existed root content before')

          // Case existed root content before
          // -> Create new root
          // -> Edit old root -> old root's previous = new root's id
          let newArticleContent = this.articleContentRepository.create(createArticleContentDto)
          let savedNewArticleContent = await this.articleContentRepository.save(newArticleContent)
          console.log('Create new root:', savedNewArticleContent)

          try {
            let oldRoot: UpdateArticleContentDto = {
              previous: newArticleContent.id,
              type: oldRootContent.type,
              content: oldRootContent.content,
              width: oldRootContent.width,
              article: oldRootContent.article,
            }
            console.log('Update old root', { id: oldRootContent.id, ...oldRoot })

            await this.articleContentRepository.update(oldRootContent.id, oldRoot)
            oldRootContent = null
          } catch (error) {
            console.log('Error when update old root:', error)

            return null
          }

          return savedNewArticleContent
        } else {
          // Not yet have root -> create root
          console.log('// Not yet have root -> create root')

          let newArticleContent = this.articleContentRepository.create(createArticleContentDto)
          return await this.articleContentRepository.save(newArticleContent)
        }
      }
    } catch (error) {
      console.log(error)

      return null
    }
  }

  async findByArticleId(articleId: string): Promise<ArticleContentEntity[]> {
    try {
      let articleContents = await this.articleContentRepository.find({
        where: { article: { id: articleId } },
        relations: ['article'], // If you want to include the category details in the result
      })
      articleContents.forEach((content, index) => {
        if (content.type === 'image') {
          articleContents[index] = {
            ...content,
            content: `${this.configService.get('API_HOST')}/${content.content}`,
          }
        }
      })
      return articleContents
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
    updateArticleContentPayloadDto: UpdateArticleContentPayloadDto,
  ): Promise<ArticleContentEntity | undefined | null> {
    try {
      let article = await this.articleRepository.findOne({ where: { id: updateArticleContentPayloadDto.articleId } })
      if (!article) return null
      let updateArticleContentDto: UpdateArticleContentDto = {
        previous: updateArticleContentPayloadDto.previous.length === 0 ? null : updateArticleContentPayloadDto.previous,
        type: updateArticleContentPayloadDto.type,
        content: updateArticleContentPayloadDto.content,
        width: updateArticleContentPayloadDto.width,
        article: article,
      }
      await this.articleContentRepository.update(id, updateArticleContentDto)
      return this.articleContentRepository.findOne({
        where: { id },
        relations: ['article'],
      })
    } catch (error) {
      return null
    }
  }

  async remove(id: string): Promise<number> {
    try {
      // 3 case:
      // 1. root content
      // -> find next content
      // -> if not existed -> delete
      // -> if existed -> change next content's previous -> root id -> delete current
      // 2. center content
      // -> find next content
      // -> if not existed -> delete
      // -> if existed -> change next content's previous -> root id -> delete current
      // 3. last content
      // -> delete current

      let currentContent = await this.articleContentRepository.findOne({
        where: { id },
        relations: ['article'],
      })
      if (currentContent) {
        let currentNextContent = await this.articleContentRepository.findOne({
          where: { previous: id },
          relations: ['article'],
        })
        if (currentNextContent) {
          if (currentContent.previous) {
            // case 2 CENTER
            try {
              let oldNext: UpdateArticleContentDto = {
                previous: currentContent.previous,
                type: currentNextContent.type,
                content: currentNextContent.content,
                width: currentNextContent.width,
                article: currentNextContent.article,
              }
              await this.articleContentRepository.update(currentNextContent.id, oldNext)
            } catch (error) {
              return -1
            }
            let result = await this.articleContentRepository.delete(id)
            return result.affected
          } else {
            // case 1 ROOT
            try {
              let oldNext: UpdateArticleContentDto = {
                previous: null,
                type: currentNextContent.type,
                content: currentNextContent.content,
                width: currentNextContent.width,
                article: currentNextContent.article,
              }
              await this.articleContentRepository.update(currentNextContent.id, oldNext)
            } catch (error) {
              return -1
            }
            let result = await this.articleContentRepository.delete(id)
            return result.affected
          }
        } else {
          // case 3 LAST CONTENT
          let result = await this.articleContentRepository.delete(id)
          return result.affected
        }
      } else {
        return 0
      }
    } catch (error) {
      return -1
    }
  }
}
