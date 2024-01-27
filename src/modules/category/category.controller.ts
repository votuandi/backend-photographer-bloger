import { Controller, Get, Post, Body, Param, Put, Delete, Res, HttpStatus, Req, UseInterceptors } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto'
import { Response } from 'express'
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { RESPONSE_TYPE } from 'src/types/commom'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request, @Res() res: Response) {
    const newCategory = await this.categoryService.create(createCategoryDto)
    if (newCategory === null) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (newCategory === undefined) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Create category failed',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: true,
        message: 'Create category successfully',
        params: newCategory,
      }
      res.status(HttpStatus.CREATED).json(response)
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`)
        },
      }),
    }),
  )
  async uploadFile(@Req() req: Request) {
    const formData = req.body as any as CreateCategoryDto
    console.log(formData.name)
    return 'OK'
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoryService.findAll()
    if (Array.isArray(categories)) {
      const response: RESPONSE_TYPE = {
        status: true,
        params: categories,
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
    const category = await this.categoryService.findOne(id)
    if (category === null) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (category === undefined) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Category not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: true,
        params: category,
      }
      res.status(HttpStatus.OK).json(response)
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
    const category = await this.categoryService.update(id, updateCategoryDto)
    if (category === null) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    } else if (category === undefined) {
      const response: RESPONSE_TYPE = {
        status: false,
        message: 'Category not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: true,
        params: category,
      }
      res.status(HttpStatus.OK).json(response)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const success = await this.categoryService.remove(id)
    if (success === 1) {
      const response: RESPONSE_TYPE = {
        status: true,
        message: `Deleted ${id}`,
      }
      res.status(HttpStatus.OK).json(response)
    } else if (success === 0) {
      const response: RESPONSE_TYPE = {
        status: true,
        message: 'Category not found',
      }
      res.status(HttpStatus.NOT_FOUND).json(response)
    } else {
      const response: RESPONSE_TYPE = {
        status: true,
        message: 'Internal Server Error',
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}
