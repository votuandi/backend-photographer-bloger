import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from 'src/entities/article.entity'
import { ArticleController } from './article.controller'
import { CategoryService } from '../category/category.service'
import { CategoryEntity } from 'src/entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, CategoryEntity])],
  controllers: [ArticleController],
  providers: [ArticleService, CategoryService],
})
export class ArticleModule {}
