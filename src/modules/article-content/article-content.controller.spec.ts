import { Test, TestingModule } from '@nestjs/testing';
import { ArticleContentController } from './article-content.controller';

describe('ArticleContentController', () => {
  let controller: ArticleContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleContentController],
    }).compile();

    controller = module.get<ArticleContentController>(ArticleContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
