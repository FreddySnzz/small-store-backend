import { 
  BadRequestException, 
  forwardRef, 
  Inject, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { toCapitalized } from '../utils/capitalize-words';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CountProductDto } from '../product/dtos/count-product.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor (
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {}

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProductDto[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total_items;
    };

    return 0;
  };

  async findAll(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Categories empty`);
    };

    const count = await this.productService.countProductsByCategoryId();

    return categories.map(
      (category) => new ReturnCategoryDto(
        category,
        this.findAmountCategoryInProducts(category, count),
      ),
    );
  };

  async createCategory(
    createCategoryDto: CreateCategoryDto
  ): Promise<CategoryEntity> {
    const category = await this
      .findCategoryByName(createCategoryDto.name)
      .catch(() => undefined);

    if (category) {
      throw new BadRequestException(`
        Category: ${createCategoryDto.name} already exists
      `);
    };

    return await this.categoryRepository.save({
      ...createCategoryDto,
      enabled: true,
    });
  };

  async findCategoryByName(
    name: string
  ): Promise<CategoryEntity[]> {
    const category = await this.categoryRepository.find({
      where: {
        name: Like(`%${toCapitalized(name)}%`),
        enabled: true,
      }
    });

    if (!category || category.length === 0) {
      throw new NotFoundException(`Category ${name} not found`);
    };

    return category;
  };

  async findCategoryById(
    id: number,
    enabledCondition?: boolean
  ): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        enabled: enabledCondition
       }
    });

    if (!category) {
      throw new NotFoundException(`Category ID: ${id} not found`);
    };

    return category;
  };

  async disableCategoryById(
    categoryId: number
  ): Promise<CategoryEntity> {
    const user = await this.findCategoryById(categoryId, undefined);

    return await this.categoryRepository.save({
      ...user,
      enabled: !user.enabled
    });
  };
}
