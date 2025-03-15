import { 
  IsNumber, 
  IsOptional, 
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  statusId: number;

  @IsNumber()
  @IsOptional()
  totalPrice: number;
}