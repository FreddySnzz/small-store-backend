import { 
  BadRequestException,
  forwardRef,
  Inject,
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { ProductService } from '../product/product.service';
import { OrderProductService } from '../order-product/order-product.service';
import { AddProductDto } from '../product/dtos/add-product.dto';
import { StatusType } from '../status/enum/status-type.enum';
import { UpdateProductDto } from '../product/dtos/update-product.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;

  @Inject(forwardRef(() => ProductService))
  private readonly productService: ProductService;

  @Inject(forwardRef(() => OrderProductService))
  private readonly orderProductService: OrderProductService;

  @Inject(forwardRef(() => CacheService))
  private readonly cacheService: CacheService;

  async getAllOrders(
    userId?: number,
    statusId?: number,
  ): Promise<OrderEntity[]> {
    let findOptions = {};

    if (userId) {
      findOptions = {
        where: {
          userId: userId,
        },
        relations: {
          user: true,
          status: true,
          orderProducts: true
        }
      };
    };

    if (statusId) {
      findOptions = {
        ...findOptions,
        where: {
          statusId: statusId,
        },
        relations: {
          status: true,
          orderProducts: true
        }
      };
    };

    const orders = await this.cacheService.getCache<OrderEntity[]>(`orders_all`, 
      () => this.orderRepository.find(findOptions)
    );

    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found');
    };

    return orders;
  };

  async saveOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderRepository.save(createOrderDto);
  };

  async createOrder(
    addProduct: AddProductDto[], 
    userId: number,
  ): Promise<OrderEntity> {
    const order = await this.saveOrder({
      userId: userId,
      statusId: StatusType.Pending,
      totalPrice: 0,
    });
    
    for(const products of addProduct) {
      const findProduct = await this.productService
        .findProductById(products.productId);

      if (findProduct.stockAmount < products.amount || findProduct.stockAmount === 0) {
        throw new BadRequestException(
          `Product: ${findProduct.name} is out of stock`
        );
      };

      await this.orderProductService.createOrderProduct(
        products.productId,
        order.id,
        findProduct.price,
        products.amount,
      ).catch((error) => {
        throw new BadRequestException(error)
      });
    };

    const orderProducts = await this.orderProductService
      .findOrderProductByOrderId(order.id);

      const finalTotalPrice = orderProducts.reduce(
        (total, orderProduct) => total + orderProduct.price, 0
      );

    return await this.orderRepository.save({
      ...order,
      totalPrice: finalTotalPrice,
    });
  };

  async findOrderById(
    orderId: number
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { 
        id: orderId 
      },
      relations: {
        status: true,
        user: true,
        orderProducts: {
          product: true,
        },
      },
    });
  
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    return order;
  };

  async updateOrderStatus(
    orderId: number, 
    statusId: number
  ): Promise<OrderEntity> {
    await this.orderRepository.update(
      orderId, 
      { statusId }
    );
  
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'status', 
        'user', 
        'orderProducts', 
        'orderProducts.product'
      ],
    });
  };
  
  async confirmOrder(
    orderId: number,
  ): Promise<OrderEntity> {
    const order = await this.findOrderById(orderId);
    
    if (order.statusId === StatusType.Done || order.statusId === StatusType.Canceled) {
      throw new BadRequestException(
        'This order has already been confirmed or canceled'
      );
    };

    for (const orderProduct of order.orderProducts) {
      const decreaseStock: UpdateProductDto = {
        stockAmount: orderProduct.product.stockAmount - orderProduct.amount,
      };
  
      await this.productService.updateProduct(
        orderProduct.productId, 
        decreaseStock
      );
    };
    
    return this.updateOrderStatus(orderId, StatusType.Done);
  };
  
  async cancelOrder(
    orderId: number,
  ): Promise<OrderEntity> {
    return this.updateOrderStatus(orderId, StatusType.Canceled);
  };
}
