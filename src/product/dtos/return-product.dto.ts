import { ReturnCategoryDto } from "../../category/dtos/return-category.dto";
import { ProductEntity } from "../entities/product.entity";

export class ReturnProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stockAmount: number;
  imageUrl?: string;
  category?: ReturnCategoryDto;

  constructor(productEntity: ProductEntity) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.description = productEntity.description;
    this.price = productEntity.price;
    this.stockAmount = productEntity.stockAmount;
    this.imageUrl = productEntity?.imageUrl 
      ? productEntity.imageUrl 
      : undefined;
    this.category = productEntity.category 
    ? new ReturnCategoryDto(productEntity.category) 
    : undefined;
  }
}