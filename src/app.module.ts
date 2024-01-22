import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MenuModule } from './modules/menu/menu.module'
import { CategoryService } from './modules/category/category.service'
import { CategoryModule } from './modules/category/category.module'
import { ArticleController } from './modules/article/article.controller'
import { ArticleModule } from './modules/article/article.module'
import { ArticleContentService } from './modules/article-content/article-content.service'
import { ArticleContentController } from './modules/article-content/article-content.controller'
import { ArticleContentModule } from './modules/article-content/article-content.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService, ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    MenuModule,
    CategoryModule,
    ArticleModule,
    ArticleContentModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServer: ConfigService) => ({
        type: 'mysql',
        host: configServer.getOrThrow<string>('HOST'),
        port: configServer.getOrThrow<number>('PORT'),
        username: configServer.getOrThrow<string>('DATABASE_USERNAME'),
        password: configServer.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configServer.getOrThrow<string>('DATABASE'),
        entities: ['/src/entities/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
        migrations: ['dist/migrations/*.ts'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, ArticleController, ArticleContentController],
  providers: [AppService, CategoryService, ArticleContentService],
})
export class AppModule {}
