import { UserEntity } from "../../user/entities/user.entity";

export class ReturnLoginDto {
  email: string;
  role: string;
  accessToken: string;

  constructor (userEntity: UserEntity) {
    this.email = userEntity.email;
    this.role = userEntity.user_type === 2 ? "User" : "Admin"
  };
}