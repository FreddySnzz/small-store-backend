import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { OrderProductService } from '../order-product.service';
import { OrderProductEntity } from '../entities/order-product.entity';
import { productMock } from '../../product/__mocks__/product.mock';
import { orderMock } from '../../order/__mocks__/order.mock';
import { orderProductMock } from '../__mocks__/order-product.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([orderProductMock]),
            save: jest.fn().mockResolvedValue(orderProductMock)
          }
        }
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get<Repository<OrderProductEntity>>
      (getRepositoryToken(OrderProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductRepository).toBeDefined();
  });

  describe('Create OrderProduct', () => {
    it('should return orderProduct in save', async () => {
      const spy = jest.spyOn(orderProductRepository, 'save');
      const orderProduct = await service.createOrderProduct(
        productMock.id,
        orderMock.id,
        orderProductMock.price,
        orderProductMock.amount,
      );
  
      expect(orderProduct).toEqual(orderProductMock);
      expect(spy.mock.calls[0][0].price).toEqual(orderProductMock.price * orderProductMock.amount);
      expect(spy.mock.calls[0][0].amount).toEqual(orderProductMock.amount);
      expect(spy.mock.calls[0][0].orderId).toEqual(orderMock.id);
      expect(spy.mock.calls[0][0].productId).toEqual(productMock.id);
    });
  
    it('should return exception in error DB', async () => {
      jest.spyOn(orderProductRepository, 'save').mockRejectedValue(new Error());
  
      expect(
        service.createOrderProduct(
          productMock.id,
          orderMock.id,
          orderProductMock.price,
          orderProductMock.amount,
        ),
      ).rejects.toThrow();
    });
  });

  describe('Find OrderProduct By ID', () => {
    it('should return orderProduct', async () => {
      const orderProduct = await service.findOrderProductByOrderId(orderMock.id);
  
      expect(orderProduct).toEqual([orderProductMock]);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(orderProductRepository, 'find').mockResolvedValue(undefined);
    
      await expect(service.findOrderProductByOrderId(orderMock.id)).rejects.toThrow(NotFoundException);
    });
  
    it('should return exception in error DB', async () => {
      jest.spyOn(orderProductRepository, 'find').mockRejectedValue(new Error());
  
      expect(service.findOrderProductByOrderId(orderMock.id)).rejects.toThrow();
    });
  });
});
