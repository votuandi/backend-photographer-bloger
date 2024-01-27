import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleContentService } from './article-content.service'
import { ArticleContentController } from './article-content.controller'
import { ArticleService } from '../article/article.service'
import { ArticleEntity } from 'src/entities/article.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleContentEntity, ArticleEntity])],
  controllers: [ArticleContentController],
  providers: [ArticleContentService, ArticleService],
})
export class ArticleContentModule {}
