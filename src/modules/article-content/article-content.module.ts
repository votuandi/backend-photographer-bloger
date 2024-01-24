import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleContentEntity } from 'src/entities/article-content.entity'
import { ArticleContentService } from './article-content.service'
import { ArticleContentController } from './article-content.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleContentEntity])],
  controllers: [ArticleContentController],
  providers: [ArticleContentService],
})
export class ArticleContentModule {}
