import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { ArticleContentService } from './article-content.service'
import {
  CreateArticleContentDto,
  CreateArticleContentPayloadDto,
  UpdateArticleContentDto,
  UpdateArticleContentPayloadDto,
} from 'src/dto/article-content.dto'
import { Response } from 'express'
import { ArticleService } from '../article/article.service'
import { RESPONSE_TYPE } from 'src/types/commom'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('article-contents')
export class ArticleContentController {
  constructor(
    private readonly articleContentService: ArticleContentService,
    private readonly articleService: ArticleService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createArticleContentPayloadDto: CreateArticleContentPayloadDto,
    @Res() res: Response,
  ) {
    let article = await this.articleService.findOne(createArticleContentPayloadDto.articleId)
    if (article) {
      let createArticleContentDto: CreateArticleContentDto = {
        previous: createArticleContentPayloadDto.previous.length === 0 ? null : createArticleContentPayloadDto.previous,
        type: createArticleContentPayloadDto.type,
        content: createArticleContentPayloadDto.content,
        width: createArticleContentPayloadDto.width,
        article: article,
      }
      let newArticleContent = await this.articleContentService.create(createArticleContentDto, image)
      if (newArticleContent === null) {
        let response: RESPONSE_TYPE = {
          status: false,
          message: 'Internal Server Error',
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
      } else if (newArticleContent === undefined) {
        let response: RESPONSE_TYPE = {
          status: false,
          message: 'Create Article Content category failed',
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
      } else {
        let response: RESPONSE_TYPE = {
          status: true,
          message: 'Created Article Content category successfully',
          params: newArticleContent,
        }
        res.status(HttpStatus.CREATED).json(response)
      }
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    let articleContents = await this.articleContentService.findAll()
    if (Array.isArray(articleContents)) {
      let response: RESPONSE_TYPE = {
        status: true,
        params: articleContents,
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

  @Get('article/:articleId')
  async findByArticleId(@Param('articleId') articleId: string, @Res() res: Response) {
    let articles = await this.articleContentService.findByArticleId(articleId)
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
    let articleContent = await this.articleContentService.findOne(id)
    if (articleContent) {
      let response: RESPONSE_TYPE = {
        status: true,
        params: articleContent,
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article Content not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleContentPayloadDto: UpdateArticleContentPayloadDto,
    @Res() res: Response,
  ) {
    console.log('updateArticleContentDto', updateArticleContentPayloadDto)

    let articleContent = await this.articleContentService.update(id, updateArticleContentPayloadDto)
    if (articleContent === null) {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (articleContent === undefined) {
      let response: RESPONSE_TYPE = {
        status: false,
        message: 'Article Content not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      let response: RESPONSE_TYPE = {
        status: true,
        params: articleContent,
      }
      res.status(HttpStatus.OK).json(response)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    let success = await this.articleContentService.remove(id)
    if (success === 1) {
      let response: RESPONSE_TYPE = {
        status: true,
        message: `Deleted ${id}`,
      }
      res.status(HttpStatus.OK).json(response)
    } else if (success === 0) {
      let response: RESPONSE_TYPE = { status: false, message: 'Article content not found' }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      let response: RESPONSE_TYPE = { status: false, message: 'Internal Server Error' }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}
