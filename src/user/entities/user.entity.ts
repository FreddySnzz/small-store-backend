import { 
  Column, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";

import { OrderEntity } from "../../order/entities/order.entity";

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'phone' })
  phone: string;

  @Column({ name: 'user_type', nullable: false })
  userType: number;

  @Column({ name: 'token', nullable: false })
  token: string;

  @Column({ name: 'enabled', nullable: false })
  enabled: boolean;

  @Column({ name: 'profile_image' })
  profileImage: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.user)
  orders?: OrderEntity;
}