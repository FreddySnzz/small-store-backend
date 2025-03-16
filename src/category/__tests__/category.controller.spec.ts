import { Test, TestingModule } from '@nestjs/testing';

import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([categoryMock]),
            createCategory: jest.fn().mockResolvedValue(createCategoryMock),
            findCategoryByName: jest.fn().mockResolvedValue([categoryMock]),
            findCategoryById: jest.fn().mockResolvedValue(categoryMock),
            toggleCategoryEnableById: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('Get All Categories', async () => {
    const categories = await controller.findAll();

    expect(categories).toEqual([categoryMock]);
  });

  it('Create Category', async () => {
    const category = await controller.createCategory(createCategoryMock);

    expect(category).toEqual({
      name: createCategoryMock.name
    });
  });

  it('Find Category By Name', async () => {
    const category = await controller.findCategoryByName(categoryMock.name);
    
    expect(category).toEqual([{
      id: categoryMock.id,
      name: categoryMock.name,
      enabled: categoryMock.enabled
    }]);
  });

  it('Find Category By ID', async () => {
    const category = await controller.findCategoryById(categoryMock.id);

    expect(category).toEqual({
      id: categoryMock.id,
      name: categoryMock.name,
      enabled: categoryMock.enabled
    });
  });

  it('Enable/disable Category By ID', async () => {
    const category = await controller.toggleCategoryEnableById(categoryMock.id);
    
    expect(category).toEqual({
      id: categoryMock.id,
      name: categoryMock.name,
      enabled: category.enabled
    });
  });
});
