import { UserEntity } from "../entities/user.entity";

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: number;
  enabled: boolean;
  profileImage?: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.userType = userEntity.userType;
    this.enabled = userEntity.enabled;
    this.profileImage = userEntity?.profileImage 
      ? userEntity.profileImage 
      : undefined;
  };
}