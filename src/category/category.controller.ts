import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Query, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Roles(UserType.User, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<ReturnCategoryDto[]> {
    return this.categoryService.findAll();
  };

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategoryDto
  ): Promise <CategoryEntity> {
    return await this.categoryService.createCategory(
      createCategory
    );
  };

  @Get('search')
  async findCategoryByName(
    @Query('category_name') categoryName: string
  ): Promise<ReturnCategoryDto[]> {
    return (await this.categoryService.findCategoryByName(
      categoryName
    )).map(
      categories => new ReturnCategoryDto(categories)
    );
  };

  @Get('/:categoryId')
  async findCategoryById(
    @Param('categoryId') categoryId: number
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.findCategoryById(categoryId, true)
    );
  };

  @Roles(UserType.Admin)
  @Get('/disable/:categoryId')
  async disableCategory(
    @Param('categoryId') categoryId: number
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoryService.disableCategoryById(categoryId)
    );
  };
}
