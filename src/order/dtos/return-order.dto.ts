import { OrderEntity } from "../entities/order.entity";
import { ReturnUserDto } from "../../user/dtos/return-user.dto";
import { ReturnStatusDto } from "../../status/dtos/return-status.dto";
import { ReturnOrderProductDto } from "../../order-product/dtos/return-order-product.dto";

export class ReturnOrderDto {
  id: number;
  user?: ReturnUserDto;
  status?: ReturnStatusDto;
  totalPrice: number;
  createdAt: Date;
  orderProducts?: ReturnOrderProductDto[];

  constructor(orderEntity: OrderEntity) {
    this.id = orderEntity.id;
    this.user = orderEntity.user 
      ? new ReturnUserDto(orderEntity.user) 
      : undefined;
    this.status = orderEntity.status 
      ? new ReturnStatusDto(orderEntity.status) 
      : undefined;
    this.createdAt = orderEntity.createdAt;
    this.totalPrice = orderEntity.totalPrice;
    this.orderProducts = orderEntity.orderProducts
      ? orderEntity.orderProducts.map(
          orderProduct => new ReturnOrderProductDto(orderProduct)
        )
      : undefined;
  }
}
