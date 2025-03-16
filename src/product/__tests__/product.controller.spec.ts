import { Test, TestingModule } from '@nestjs/testing';

import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productMock } from '../__mocks__/product.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';
import { returnProductMock } from '../__mocks__/return-product.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';
import { createProductMock } from '../__mocks__/create-product.mock';
import { addProductMock } from '../__mocks__/add-product.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productMock]),
            findAllByCategoryId: jest.fn().mockResolvedValue([productMock]),
            findProductByName: jest.fn().mockResolvedValue([productMock]),
            findProductById: jest.fn().mockResolvedValue(productMock),
            createProduct: jest.fn().mockResolvedValue(productMock),
            deleteProductById: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(productMock),
          },
        },
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('Get All Products', async () => {
    const products = await controller.findAll([addProductMock]);

    expect(products).toEqual([returnProductMock]);
  });

  it('Get All Products By Category ID', async () => {
    const products = await controller.findAllByCategoryId(productMock.categoryId);

    expect(products).toEqual([returnProductMock]);
  });

  it('Get All Products By Name', async () => {
    const products = await controller.findProductByName(productMock.name);

    expect(products).toEqual([returnProductMock]);
  });

  it('Get Product By ID', async () => {
    const product = await controller.findProductById(productMock.id);

    expect(product).toEqual(returnProductMock);
  });

  it('Create Product', async () => {
    const product = await controller.createProduct(createProductMock);

    expect(product).toEqual(productMock);
  });

  it('Delete Product By ID', async () => {
    const product = await controller.deleteProductById(productMock.id);

    expect(product).toEqual(returnDeleteMock);
  });

  it('Update Product', async () => {
    const product = await controller.updateProduct(
      productMock.id, 
      updateProductMock
    );

    expect(product).toEqual(productMock);
  });
});
