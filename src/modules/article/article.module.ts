import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from 'src/entities/article.entity'
import { ArticleController } from './article.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
