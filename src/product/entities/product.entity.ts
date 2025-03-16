import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { CategoryEntity } from "../../category/entities/category.entity";
import { OrderProductEntity } from "../../order-product/entities/order-product.entity";

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'stock_amount', nullable: false })
  stockAmount: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;

  @OneToMany(
    () => OrderProductEntity, 
    (orderProducts: OrderProductEntity) => orderProducts.product
  )
  orderProducts?: OrderProductEntity;
}