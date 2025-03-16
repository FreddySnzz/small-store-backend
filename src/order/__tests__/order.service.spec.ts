import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { OrderService } from '../order.service';
import { OrderEntity } from '../entities/order.entity';
import { ProductService } from '../../product/product.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { CacheService } from '../../cache/cache.service';
import { orderMock, confirmOrderMock } from '../__mocks__/order.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { confirmOrderProductMock, orderProductMock } from '../../order-product/__mocks__/order-product.mock';
import { createOrderMock } from '../__mocks__/create-order.mock';
import { addProductMock } from '../../product/__mocks__/add-product.mock';
import { StatusType } from '../../status/enum/status-type.enum';
import { userEntityMock } from '../../user/__mocks__/user.mock';

describe('OrderService', () => {
  let service: OrderService;
  let productService: ProductService;
  let orderProductService: OrderProductService;
  let cacheService: CacheService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([orderMock]),
            findOne: jest.fn().mockResolvedValue(orderMock),
            save: jest.fn().mockResolvedValue(orderMock),
            update: jest.fn().mockResolvedValue(orderMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productMock),
            updateProduct: jest.fn().mockResolvedValue(productMock),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue(orderProductMock),
            findOrderProductByOrderId: jest.fn().mockResolvedValue([orderProductMock]),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    productService = module.get<ProductService>(ProductService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    cacheService = module.get<CacheService>(CacheService);
    orderRepository = module.get<Repository<OrderEntity>>(getRepositoryToken(OrderEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(cacheService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      jest.spyOn(cacheService, 'getCache').mockImplementation((key, callback) => callback());
      jest.spyOn(orderRepository, 'find').mockResolvedValue([orderMock]);
  
      const result = await service.getAllOrders(userEntityMock.id);
      const resultWithOrderStatus = await service.getAllOrders(userEntityMock.id, 1);
  
      expect(result).toEqual([orderMock]);
      expect(resultWithOrderStatus).toEqual([orderMock]);
      expect(cacheService.getCache).toHaveBeenCalledWith('orders_all', expect.any(Function));
      expect(orderRepository.find).toHaveBeenCalledTimes(2);
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: {
          userId: userEntityMock.id,
        },
        relations: {
          user: true,
          status: true,
          orderProducts: true,
        },
      });
    });

    it('should return cached orders if available', async () => {
      const cachedOrders: OrderEntity[] = [orderMock];

      jest.spyOn(cacheService, 'getCache').mockResolvedValue(cachedOrders);

      const result = await service.getAllOrders(userEntityMock.id);

      expect(result).toEqual(cachedOrders);
      expect(cacheService.getCache).toHaveBeenCalledWith('orders_all', expect.any(Function));
      expect(orderRepository.find).not.toHaveBeenCalled();
    });

    it('should fetch orders from the database if not in cache', async () => {
      const dbOrders: OrderEntity[] = [orderMock];

      jest.spyOn(cacheService, 'getCache').mockImplementation((key, callback) => callback());
      jest.spyOn(orderRepository, 'find').mockResolvedValue(dbOrders);

      const result = await service.getAllOrders(userEntityMock.id);

      expect(result).toEqual(dbOrders);
      expect(cacheService.getCache).toHaveBeenCalledWith('orders_all', expect.any(Function));
      expect(orderRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if no orders are found', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

      await expect(service.getAllOrders()).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveOrder', () => {
    it('should save an order', async () => {
      const result = await service.saveOrder(createOrderMock);

      expect(result).toEqual(orderMock);
      expect(orderRepository.save).toHaveBeenCalledWith(createOrderMock);
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const result = await service.createOrder([addProductMock], userEntityMock.id);

      expect(result).toEqual(orderMock);
      expect(productService.findProductById).toHaveBeenCalledWith(addProductMock.productId);
      expect(orderProductService.createOrderProduct).toHaveBeenCalledWith(
        addProductMock.productId,
        orderMock.id,
        productMock.price,
        addProductMock.amount,
      );
      expect(orderRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if a product is out of stock', async () => {
      jest.spyOn(productService, 'findProductById').mockResolvedValue({
        ...productMock,
        stockAmount: 0,
      });

      await expect(service.createOrder(
        [addProductMock], 
        userEntityMock.id
      )).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOrderById', () => {
    it('should find an order by ID', async () => {
      const result = await service.findOrderById(orderMock.id);

      expect(result).toEqual(orderMock);
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderMock.id },
        relations: {
          status: true,
          user: true,
          orderProducts: {
            product: true,
          },
        },
      });
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOrderById(orderMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status', async () => {
      const result = await service.updateOrderStatus(orderMock.id, StatusType.Done);

      expect(result).toEqual(orderMock);
      expect(orderRepository.update).toHaveBeenCalledWith(orderMock.id, { statusId: StatusType.Done });
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: { id: orderMock.id },
        relations: ['status', 'user', 'orderProducts', 'orderProducts.product'],
      });
    });
  });

  describe('confirmOrder', () => {
    it('should confirm an order', async () => {
      jest.spyOn(service, 'findOrderById').mockResolvedValue({
        ...confirmOrderMock,
        statusId: StatusType.Pending,
      });

      const result = await service.confirmOrder(confirmOrderMock.id);

      expect({
        ...result,
        orderProducts: [confirmOrderProductMock]
      }).toEqual(confirmOrderMock);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        orderProductMock.productId,
        { stockAmount: productMock.stockAmount - orderProductMock.amount },
      );
    });

    it('should throw BadRequestException if order is already confirmed or canceled', async () => {
      jest.spyOn(service, 'findOrderById').mockResolvedValue({
        ...orderMock,
        statusId: StatusType.Done,
      });

      await expect(service.confirmOrder(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const result = await service.cancelOrder(orderMock.id);

      expect(result).toEqual(orderMock);
    });
  });
});