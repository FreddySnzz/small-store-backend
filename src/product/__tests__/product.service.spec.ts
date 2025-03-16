import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { ProductService } from '../product.service';
import { ProductEntity } from '../entities/product.entity';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { productMock } from '../__mocks__/product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';
import { addProductMock } from '../__mocks__/add-product.mock';
import { countProductMock } from '../__mocks__/count-product.mock';
import { CacheService } from '../../cache/cache.service';

describe('ProductService', () => {
  let service: ProductService;
  let categoryService: CategoryService;
  let cacheService: CacheService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock)
          }
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            save: jest.fn().mockResolvedValue(createProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
            createQueryBuilder: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              groupBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockResolvedValue([countProductMock]),
            }),
          }
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([productMock]),
          }
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    cacheService = module.get<CacheService>(CacheService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(cacheService).toBeDefined();
  });

  describe('Find all products', () => {
    it('should return all products', async () => {
      const products = await service.findAll();
  
      expect(products).toEqual([productMock]);
    });

    it('should return all products searching by id', async () => {
      const products = await service.findAll([addProductMock]);
      
      expect(products).toEqual([productMock]);
    });

    it('should return all products searching by id and with relations', async () => {
      const products = await service.findAll([addProductMock], true);
      
      expect(products).toEqual([productMock]);
    });
  });

  describe('Find all products by category id', () => {
    it('should return all products by category id', async () => {
      const products = await service.findAllByCategoryId(categoryMock.id);
  
      expect(products).toEqual([productMock]);
    });

    it('should handle error from findAllByCategoryId gracefully', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValueOnce(new NotFoundException());
    
      await expect(service.findAllByCategoryId(categoryMock.id)).rejects.toThrow(
        new NotFoundException()
      );
    });
  });

  describe('Find products by id', () => {
    it('should return product by id', async () => {
      const product = await service.findProductById(productMock.id);
  
      expect(product).toEqual(productMock);
    });
  
    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, "findOne").mockResolvedValue(undefined);
  
      expect(service.findProductById(productMock.id)).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "findOne").mockRejectedValue(new Error());
  
      expect(service.findProductById(productMock.id)).rejects.toThrow();
    });
  });

  describe('Find products by name', () => {
    it('should return products by name', async () => {
      const product = await service.findProductByName(productMock.name);
  
      expect(product).toEqual([productMock]);
    });
  
    it('should return error if product not found', async () => {
      jest.spyOn(productRepository, "find").mockResolvedValue([]);
  
      expect(service.findProductByName(productMock.name)).rejects.toThrow();
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "find").mockRejectedValue(new Error());
  
      expect(service.findProductByName(productMock.name)).rejects.toThrow();
    });
  });

  describe('Create product', () => {
    it('should return product created', async () => {
      jest.spyOn(categoryService, "findCategoryById").mockResolvedValue(categoryMock);
      jest.spyOn(productRepository, "find").mockResolvedValue([]);

      const product = await service.createProduct(createProductMock);
  
      expect(product).toEqual(createProductMock);
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "save").mockRejectedValue(new Error());
  
      expect(service.createProduct(createProductMock)).rejects.toThrow();
    });
  });

  describe('Delete product by id', () => {
    it('should return product deleted', async () => {
      const productDeleted = await service.deleteProductById(productMock.id);
  
      expect(productDeleted).toEqual(returnDeleteMock);
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "delete").mockRejectedValue(new Error());
  
      expect(service.deleteProductById(productMock.id)).rejects.toThrow();
    });
  });

  describe('Update product by id', () => {
    it('should return product updated', async () => {
      const productUpdated = await service.updateProduct(
        productMock.id, 
        updateProductMock
      );

      expect(productUpdated).toEqual({
        categoryId: createProductMock.categoryId,
        name: createProductMock.name,
        description: createProductMock.description,
        price: createProductMock.price,
        stockAmount: createProductMock.stockAmount,
        imageUrl: createProductMock.imageUrl,
      });
    });
  
    it('should return error if exception', async () => {
      jest.spyOn(productRepository, "save").mockRejectedValue(new Error());
  
      expect(service.updateProduct(
        productMock.id, 
        updateProductMock
      )).rejects.toThrow();
    });
  });

  describe('Count products by category Id', () => {
    it('should return total products in category', async () => {
      const productsCount = await service.countProductsByCategory();

      expect(productsCount).toEqual([countProductMock]);
    });
  });
});
