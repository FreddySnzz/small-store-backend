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

import { UserEntity } from "../../user/entities/user.entity";
import { StatusEntity } from "../../status/entities/status.entity";
import { OrderProductEntity } from "../../order-product/entities/order-product.entity";

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'status_id', nullable: false })
  statusId: number;

  @Column({ name: 'total_price', nullable: false })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => StatusEntity, (status) => status.orders)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  status?: StatusEntity;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
  orderProducts: OrderProductEntity[];
}
