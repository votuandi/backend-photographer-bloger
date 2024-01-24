import { Controller, Get, Post, Body, Param, Put, Delete, Res, HttpStatus, Req } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from 'src/dto/category.dto'
import { Response } from 'express'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request, @Res() res: Response) {
    console.log('CREATE_CATEGORY')
    console.log(req.headers)
    console.log(req)

    const newCategory = await this.categoryService.create(createCategoryDto)
    if (newCategory === null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
    } else if (newCategory === undefined) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Create category failed' })
    } else {
      res.status(HttpStatus.CREATED).json(newCategory)
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    const categories = await this.categoryService.findAll()
    if (Array.isArray(categories)) {
      res.status(HttpStatus.OK).json(categories)
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const category = await this.categoryService.findOne(id)
    if (category === null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    } else if (category === undefined) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Category not found' })
    } else {
      res.status(HttpStatus.OK).json(category)
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: Response) {
    const category = await this.categoryService.update(id, updateCategoryDto)
    if (category === null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    } else if (category === undefined) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Category not found' })
    } else {
      res.status(HttpStatus.OK).json(category)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const success = await this.categoryService.remove(id)
    if (success) {
      res.status(HttpStatus.NO_CONTENT).send()
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }
}
