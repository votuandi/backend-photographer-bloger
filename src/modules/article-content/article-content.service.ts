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
      // Case previous is a content
      if (createArticleContentDto.previous) {
        console.log('Case previous is a content')

        // Find previous content
        const previousContent = await this.articleContentRepository.findOne({
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
          const currentNextOfPreviousContent = await this.articleContentRepository.findOne({
            where: { previous: previousContent.id, article: createArticleContentDto.article },
            relations: ['article'],
          })
          if (currentNextOfPreviousContent) {
            // Case current next content of previous content is existed
            console.log('Case current next content of previous content is existed')

            const newArticleContent = this.articleContentRepository.create(createArticleContentDto)

            try {
              const oldNext: UpdateArticleContentDto = {
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

            const savedNewArticleContent = await this.articleContentRepository.save(newArticleContent)
            return savedNewArticleContent
          } else {
            // Case current next content of previous content is not existed
            console.log('Case THE LAST CONTENT')

            const newArticleContent = this.articleContentRepository.create(createArticleContentDto)
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

        const previousContent = await this.articleContentRepository.findOne({
          where: { id: null, article: createArticleContentDto.article },
          relations: ['article'],
        })
        if (previousContent) {
          console.log('Case existed root content before')

          // Case existed root content before
          // -> Create new root
          // -> Edit old root -> old root's previous = new root's id
          const newArticleContent = this.articleContentRepository.create(createArticleContentDto)

          try {
            const oldRoot: UpdateArticleContentDto = {
              previous: newArticleContent.id,
              type: previousContent.type,
              content: previousContent.content,
              width: previousContent.width,
              article: previousContent.article,
            }
            await this.articleContentRepository.update(previousContent.id, oldRoot)
          } catch (error) {
            return null
          }

          const savedNewArticleContent = await this.articleContentRepository.save(newArticleContent)
          return savedNewArticleContent
        } else {
          // Not yet have root -> create root
          console.log('// Not yet have root -> create root')

          const newArticleContent = this.articleContentRepository.create(createArticleContentDto)
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
      const articleContent = await this.articleContentRepository.find({
        where: { article: { id: articleId } },
        relations: ['article'], // If you want to include the category details in the result
      })
      return articleContent
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

      const currentContent = await this.articleContentRepository.findOne({
        where: { id },
        relations: ['article'],
      })
      if (currentContent) {
        const currentNextContent = await this.articleContentRepository.findOne({
          where: { previous: id },
          relations: ['article'],
        })
        if (currentNextContent) {
          if (currentContent.previous) {
            // case 2 CENTER
            try {
              const oldNext: UpdateArticleContentDto = {
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
            const result = await this.articleContentRepository.delete(id)
            return result.affected
          } else {
            // case 1 ROOT
            try {
              const oldNext: UpdateArticleContentDto = {
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
            const result = await this.articleContentRepository.delete(id)
            return result.affected
          }
        } else {
          // case 3 LAST CONTENT
          const result = await this.articleContentRepository.delete(id)
          return result.affected
        }
      } else {
        return 0
      }
      // const result = await this.articleContentRepository.delete(id)
      // return result.affected
    } catch (error) {
      return -1
    }
  }
}
