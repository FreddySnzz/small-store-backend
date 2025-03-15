import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  Query, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';

import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnProductDto } from './dtos/return-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AddProductDto } from './dtos/add-product.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor (
    private readonly productService: ProductService
  ) {}

  @Get()
  async findAll(
    @Body() productData: AddProductDto[],
  ): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll(
      productData, 
      true
    )).map(
      product => new ReturnProductDto(product)
    );
  };
  
  @Get('search-by-category')
  async findAllByCategoryId(
    @Query('category_id') categoryId: number
  ): Promise<ReturnProductDto[]> {
    return (await this.productService.findAllByCategoryId(
      categoryId
    )).map(
      product => new ReturnProductDto(product)
    );
  };

  @Get('search-by-name')
  async findProductByName(
    @Query('product_name') productName: string
  ): Promise<ReturnProductDto[]> {
    return (await this.productService.findProductByName(
      productName
    )).map(
      product => new ReturnProductDto(product)
    );
  };

  @Get('/:id')
  async findProductById(
    @Param('id') id: number
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.findProductById(id)
    );
  };

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto
  ): Promise<ProductEntity> {
    return await this.productService.createProduct(createProduct);
  };

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProductById(
    @Param('productId') productId: number
  ): Promise<DeleteResult> {
    return await this.productService.deleteProductById(productId);
  };

  @Roles(UserType.Admin)
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<ReturnProductDto> {
    return await this.productService.updateProduct(
      productId, updateProductDto
    );
  };
}
