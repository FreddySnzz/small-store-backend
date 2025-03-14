import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";

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
  user_type: number;

  @Column({ name: 'token', nullable: false })
  token: string;

  @Column({ name: 'enabled', nullable: false })
  enabled: boolean;

  @Column({ name: 'profile_image' })
  profile_image: string;

  @Column({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'updated_at' })
  updated_at: Date;
}