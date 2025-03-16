import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

import { ProductEntity } from "../../product/entities/product.entity";

@Entity({ name: 'category' })
export class CategoryEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'enabled', nullable: false })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.category)
  products?: ProductEntity;
}