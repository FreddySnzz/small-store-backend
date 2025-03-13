import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { typeOrmService } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmService.getTypeormConfig()),
    OrderModule, 
    ProductModule, 
    UserModule, 
    CategoryModule],
  providers: [],
})
export class AppModule {}
