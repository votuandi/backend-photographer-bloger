import { CreateArticlePayloadDto, UpdateArticlePayloadDto } from './../../dto/article.dto'
import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, Res } from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto, UpdateArticleDto } from 'src/dto/article.dto'
import { Response } from 'express'
import { CategoryService } from '../category/category.service'
import { RESPONSE_TYPE } from 'src/types/commom'

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  async create(@Body() createArticlePayloadDto: CreateArticlePayloadDto, @Res() res: Response) {
    const category = await this.categoryService.findOne(createArticlePayloadDto.categoryId)
    if (category) {
      const createTime = new Date()
      const createArticleDto: CreateArticleDto = {
        title: createArticlePayloadDto.title,
        shortDescription: createArticlePayloadDto.shortDescription,
        createBy: createArticlePayloadDto.createBy,
        createTime: createTime,
        category: category,
      }
      const newArticle = await this.articleService.create(createArticleDto)
      if (newArticle === null) {
        const response: RESPONSE_TYPE = {
          status: false,
          message: 'Internal Server Error',
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
      } else if (newArticle === undefined) {
        const response: RESPONSE_TYPE = {
          status: false,
          message: 'Create article failed',
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
      } else {
        const response: RESPONSE_TYPE = {
          status: true,
          message: 'Create article successfully',
          params: newArticle,
        }
        res.status(HttpStatus.CREATED).json(response)
      }
    } else {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Category not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string, @Res() res: Response) {
    const articles = await this.articleService.findByCategoryId(categoryId)
    if (Array.isArray(articles)) {
      const response: RESPONSE_TYPE = {
        status: true,
        params: articles,
      }
      res.status(HttpStatus.OK).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const articles = await this.articleService.findAll()
    if (Array.isArray(articles)) {
      const response: RESPONSE_TYPE = {
        status: true,
        params: articles,
      }
      res.status(HttpStatus.OK).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const article = await this.articleService.findOne(id)
    if (article === null) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (article === undefined) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: true,
        params: article,
      }
      res.status(HttpStatus.OK).json(response)
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticlePayloadDto: UpdateArticlePayloadDto,
    @Res() res: Response,
  ) {
    const article = await this.articleService.findOne(id)
    if (article) {
      const category = await this.categoryService.findOne(updateArticlePayloadDto.categoryId)
      if (category) {
        const updateArticleDto: UpdateArticleDto = {
          title: updateArticlePayloadDto.title,
          shortDescription: updateArticlePayloadDto.shortDescription,
          category: category,
          createTime: article.createTime,
          createBy: article.createBy,
        }
        const newArticle = await this.articleService.update(id, updateArticleDto)
        if (newArticle === null) {
          const response: RESPONSE_TYPE = {
            status: false,
            message: 'Internal Server Error',
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
        } else if (newArticle === undefined) {
          const response: RESPONSE_TYPE = {
            status: false,
            message: 'Article not found',
          }
          res.status(HttpStatus.NOT_FOUND).json(response)
        } else {
          const response: RESPONSE_TYPE = {
            status: true,
            message: 'Create article successfully!',
            params: newArticle,
          }
          res.status(HttpStatus.OK).json(response)
        }
      } else {
        const response: RESPONSE_TYPE = {
          status: false,
          message: 'Category not found',
        }
        res.status(HttpStatus.NOT_FOUND).json(response)
      }
    } else {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const success = await this.articleService.remove(id)
    if (success === 1) {
      const response: RESPONSE_TYPE = {
        status: true,
        message: `Deleted ${id}`,
      }
      res.status(HttpStatus.OK).json(response)
    } else if (success === 0) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}
