import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from 'src/entities/category.entity'
import { CategoryService } from './category.service'
import { ArticleEntity } from 'src/entities/article.entity'
import { ArticleService } from '../article/article.service'
import { ArticleContentService } from '../article-content/article-content.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([CategoryEntity, ArticleContentEntity, ArticleEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleService, ArticleContentService],
})
export class CategoryModule {}
