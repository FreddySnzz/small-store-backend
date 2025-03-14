import { UserEntity } from "../entities/user.entity";

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: number;
  enabled: boolean;
  profile_image?: string;

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.user_type = userEntity.user_type;
    this.enabled = userEntity.enabled;
    this.profile_image = userEntity?.profile_image 
      ? userEntity.profile_image 
      : undefined;
  };
}