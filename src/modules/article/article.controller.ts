import { CreateArticlePayloadDto, UpdateArticlePayloadDto } from './../../dto/article.dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto, UpdateArticleDto } from 'src/dto/article.dto'
import { Response } from 'express'
import { CategoryService } from '../category/category.service'
import { RESPONSE_TYPE } from 'src/types/commom'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() createArticlePayloadDto: CreateArticlePayloadDto,
    @Res() res: Response,
  ) {
    console.log('CREATE ARTICLE')
    console.log('DTO', createArticlePayloadDto)

    if (thumbnail) {
      let category = await this.categoryService.findOne(createArticlePayloadDto.categoryId)
      if (category) {
        let createTime = new Date()
        let publicTime: Date = createArticlePayloadDto.publicTime
          ? new Date(createArticlePayloadDto.publicTime)
          : createTime
        let createArticleDto: CreateArticleDto = {
          title: createArticlePayloadDto.title,
          shortDescription: createArticlePayloadDto.shortDescription,
          createBy: createArticlePayloadDto.createBy,
          createTime: createTime,
          category: category,
          active: createArticlePayloadDto.active === '1',
          publicTime: publicTime,
          hashtag: createArticlePayloadDto.hashtag,
        }
        let newArticle = await this.articleService.create(createArticleDto, thumbnail)
        if (newArticle === null) {
          let response: RESPONSE_TYPE = {
            status: false,
            message: 'Internal Server Error',
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
        } else if (newArticle === undefined) {
          let response: RESPONSE_TYPE = {
            status: false,
            message: 'Create article failed',
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
        } else {
          let response: RESPONSE_TYPE = {
            status: true,
            message: 'Create article successfully',
            params: newArticle,
          }
          res.status(HttpStatus.CREATED).json(response)
        }
      } else {
        let response: RESPONSE_TYPE = {
          status: false,
          message: 'Category not found',
        }
        res.status(HttpStatus.NOT_FOUND).json(response)
      }
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Image not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Get('category/:categoryId')
  async findByCategoryId(@Param('categoryId') categoryId: string, @Res() res: Response) {
    let articles = await this.articleService.findByCategoryId(categoryId)
    if (Array.isArray(articles)) {
      let response: RESPONSE_TYPE = {
        status: true,
        params: articles,
      }
      res.status(HttpStatus.OK).json(response)
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    let articles = await this.articleService.findAll()
    if (Array.isArray(articles)) {
      let response: RESPONSE_TYPE = {
        status: true,
        params: articles,
      }
      res.status(HttpStatus.OK).json(response)
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    let article = await this.articleService.findOne(id)
    if (article === null) {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (article === undefined) {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      let response: RESPONSE_TYPE = {
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
    let article = await this.articleService.findOne(id)
    if (article) {
      let category = await this.categoryService.findOne(updateArticlePayloadDto.categoryId)
      if (category) {
        let updateArticleDto: UpdateArticleDto = {
          title: updateArticlePayloadDto.title,
          shortDescription: updateArticlePayloadDto.shortDescription,
          category: category,
          createTime: article.createTime,
          createBy: article.createBy,
          active: updateArticlePayloadDto.active,
        }
        let newArticle = await this.articleService.update(id, updateArticleDto)
        if (newArticle === null) {
          let response: RESPONSE_TYPE = {
            status: false,
            message: 'Internal Server Error',
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
        } else if (newArticle === undefined) {
          let response: RESPONSE_TYPE = {
            status: false,
            message: 'Article not found',
          }
          res.status(HttpStatus.NOT_FOUND).json(response)
        } else {
          let response: RESPONSE_TYPE = {
            status: true,
            message: 'Create article successfully!',
            params: newArticle,
          }
          res.status(HttpStatus.OK).json(response)
        }
      } else {
        let response: RESPONSE_TYPE = {
          status: false,
          message: 'Category not found',
        }
        res.status(HttpStatus.NOT_FOUND).json(response)
      }
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    let success = await this.articleService.remove(id)
    if (success === 1) {
      let response: RESPONSE_TYPE = {
        status: true,
        message: `Deleted ${id}`,
      }
      res.status(HttpStatus.OK).json(response)
    } else if (success === 0) {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}
