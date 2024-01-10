import { Controller, Delete, Get, Post, Put } from '@nestjs/common'

@Controller('menu')
export class MenuController {
  @Get()
  getAllMenus(): string {
    return 'GET ALL MENUS'
  }

  @Get()
  getMenusByLevel(): string {
    return 'GET ALL MENUS BY LEVEL'
  }

  @Get('/:id')
  getMenu(): string {
    return 'GET MENU'
  }

  @Post()
  createMenu(): string {
    return 'POST MENU'
  }

  @Put('/:id')
  editMenu(): string {
    return 'PUT MENU'
  }

  @Delete('/:id')
  deleteMenu(): string {
    return 'DELETE MENU'
  }
}
