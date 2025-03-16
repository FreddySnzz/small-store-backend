import { StatusEntity } from "../entities/status.entity";

export class ReturnStatusDto {
  id: number;
  name: string;

  constructor(status: StatusEntity) {
    this.id = status.id;
    this.name = status.name;
  };
}