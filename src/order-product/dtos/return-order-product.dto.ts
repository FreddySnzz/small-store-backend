import { ReturnProductDto } from "../../product/dtos/return-product.dto";
import { OrderProductEntity } from "../entities/order-product.entity";

export class ReturnOrderProductDto {
  id: number;
  productId: number;
  product?: ReturnProductDto;
  amount: number;
  price: number;
  createdAt: Date;

  constructor(orderProductEntity: OrderProductEntity) {
    this.id = orderProductEntity.id;
    this.productId = orderProductEntity.productId;
    this.product = orderProductEntity.product 
      ? new ReturnProductDto(orderProductEntity.product) 
      : undefined;
    this.amount = orderProductEntity.amount;
    this.price = orderProductEntity.price;
    this.createdAt = orderProductEntity.createdAt;
  }
}
