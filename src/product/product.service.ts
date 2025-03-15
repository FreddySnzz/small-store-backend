import { 
  BadRequestException,
  forwardRef, 
  Inject, 
  Injectable, 
  NotFoundException
} from '@nestjs/common';
import { 
  DeleteResult, 
  In, 
  Like, 
  Repository, 
  UpdateResult 
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AddProductDto } from './dtos/add-product.dto';

@Injectable()
export class ProductService {
  constructor (
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}

  async findAll(
    productsData?: AddProductDto[],
    isFindRelations?: boolean
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productsData && productsData.length > 0) {
      const productIds = productsData.map(product => product.productId);
      findOptions = {
        where: {
          id: In(productIds),
        },
      };
    };

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true
        }
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException(`Products not found`);
    };

    return products;
  };

  async findAllByCategoryId(
    categoryId: number
  ): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      where: {
        categoryId: categoryId
      }
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(`Products not found by category ID: ${categoryId}`);
    };

    return products;
  };

  async findProductById(
    id: number
  ): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id
      }
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    };

    return product;
  };

  async findProductByName(
    name: string
  ): Promise<ProductEntity[]> {
    const product = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`)
      }
    });

    if (!product || product.length === 0) {
      throw new NotFoundException(`Product ${name} not found`);
    };

    return product;
  };

  async createProduct(
    createProductDto: CreateProductDto
  ): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProductDto.categoryId);

    const product = await this.findProductByName(createProductDto.name).catch(() => undefined);

    if (product) {
      throw new BadRequestException(`Product ${createProductDto.name} already exists`);
    };

    return await this.productRepository.save(createProductDto);
  };

  async deleteProductById(
    productId: number
  ): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  };

  async updateProduct(
    productId: number, 
    updateProduct: UpdateProductDto
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct
    });
  };

  async countProductsByCategoryId(): Promise<any> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id', 'category_id')
      .addSelect('COUNT(*)', 'total_items')
      .groupBy('product.category_id')
      .getRawMany();
  };
}
