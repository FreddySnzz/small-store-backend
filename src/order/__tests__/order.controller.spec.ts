import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock } from '../__mocks__/order.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { addProductMock } from '../../product/__mocks__/add-product.mock';
import { returnOrderMock } from '../__mocks__/return-order.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderMock),
            findOrderById: jest.fn().mockResolvedValue(orderMock),
            confirmOrder: jest.fn().mockResolvedValue(orderMock),
            cancelOrder: jest.fn().mockResolvedValue(orderMock),
            getAllOrders: jest.fn().mockResolvedValue([orderMock]),
          },
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  it('should return order in createOrder', async () => {
    const order = await controller.createOrder(
      [addProductMock], 
      userEntityMock.id
    );

    expect(order).toEqual({
      ...returnOrderMock,
      createdAt: order.createdAt,
    });
  });

  it('should return orders in findOrderById', async () => {
    const orders = await controller.findOrderById(userEntityMock.id);
    
    expect(orders).toEqual({
      ...returnOrderMock,
      createdAt: orders.createdAt,
    });
  });

  it('should return order in findOrderById', async () => {
    const spy = jest.spyOn(orderService, 'findOrderById');
    const orders = await controller.findOrderById(orderMock.id);

    expect(orders).toEqual({
      ...returnOrderMock,
      createdAt: orders.createdAt,
    });
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return all orders', async () => {
    const spy = jest.spyOn(orderService, 'getAllOrders');
    const orders = await controller.getAllOrders();

    expect(orders).toEqual([{
      ...returnOrderMock,
      createdAt: orders[0].createdAt,
    }]);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return order alter confirm', async () => {
    const spy = jest.spyOn(orderService, 'confirmOrder');
    const order = await controller.confirmOrder(orderMock.id);

    expect(order).toEqual({
      ...returnOrderMock,
      createdAt: order.createdAt,
    });
  });

  it('should return order alter cancel', async () => {
    const spy = jest.spyOn(orderService, 'cancelOrder');
    const order = await controller.cancelOrder(orderMock.id);

    expect(order).toEqual({
      ...returnOrderMock,
      createdAt: order.createdAt,
    });
  });
});