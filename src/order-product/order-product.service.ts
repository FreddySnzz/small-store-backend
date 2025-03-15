import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderProductEntity } from './entities/order-product.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>
  ) {}

  async createOrderProduct(
    productId: number,
    orderId: number,
    price: number,
    amount: number,
  ): Promise<any> {
    const finalPrice = price * amount;

    return this.orderProductRepository.save({
      productId,
      orderId,
      price: finalPrice,
      amount,
    });
  };

  async findOrderProductByOrderId(
    orderId: number
  ): Promise<OrderProductEntity[]> {
    return this.orderProductRepository.find({
      where: {
        orderId,
      },
    });
  };
}
