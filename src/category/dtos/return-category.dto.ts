import { CategoryEntity } from "../entities/category.entity";

export class ReturnCategoryDto {
  id: number;
  name: string;
  enabled: boolean;
  amountProducts?: number;

  constructor(categoryEntity: CategoryEntity, amountProducts?: number) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
    this.enabled = categoryEntity.enabled;
    this.amountProducts = amountProducts;
  };
}