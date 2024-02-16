import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleContentService } from './article-content.service'
import { ArticleContentController } from './article-content.controller'
import { ArticleService } from '../article/article.service'
import { ArticleEntity } from 'src/entities/article.entity'
import { ConfigModule } from '@nestjs/config'
import { CategoryEntity } from 'src/entities/category.entity'
import { CategoryService } from '../category/category.service'

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([ArticleContentEntity, ArticleEntity, CategoryEntity])],
  controllers: [ArticleContentController],
  providers: [ArticleContentService, ArticleService, CategoryService],
})
export class ArticleContentModule {}
