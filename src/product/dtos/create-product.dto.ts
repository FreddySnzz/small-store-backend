import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsNumber()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
  
  @IsNumber()
  price: number;
  
  @IsNumber()
  stockAmount: number;
  
  @IsString()
  @IsOptional()
  imageUrl: string;
}