import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  
  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @Column({ name: 'status_id', nullable: false })
  status_id: number;

  @Column({ name: 'total_price', nullable: false })
  total_price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}