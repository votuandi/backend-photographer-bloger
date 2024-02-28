import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoryModule } from './modules/category/category.module'
import { ArticleModule } from './modules/article/article.module'
import { ArticleContentModule } from './modules/article-content/article-content.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { BannerModule } from './modules/banner/banner.module'

@Module({
  imports: [
    CategoryModule,
    ArticleModule,
    ArticleContentModule,
    BannerModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServer: ConfigService) => ({
        type: 'mysql',
        host: configServer.getOrThrow<string>('DATABASE_HOST'),
        port: configServer.getOrThrow<number>('DATABASE_PORT'),
        username: configServer.getOrThrow<string>('DATABASE_USERNAME'),
        password: configServer.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configServer.getOrThrow<string>('DATABASE'),
        entities: ['/src/entities/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
        migrations: ['/src/migrations/*.ts'],
        cli: {
          migrationsDir: 'src/migration',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
