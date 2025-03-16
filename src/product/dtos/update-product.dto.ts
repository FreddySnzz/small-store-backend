import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  categoryId?: number;
  
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  imageUrl?: string;
  
  @IsNumber()
  @IsOptional()
  price?: number;
  
  @IsNumber()
  @IsOptional()
  stockAmount?: number;
}