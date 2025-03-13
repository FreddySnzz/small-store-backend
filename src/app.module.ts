import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { typeOrmService } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { StatusModule } from './status/status.module';
import { OrderProductModule } from './order_product/order_product.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmService.getTypeormConfig()),
    OrderModule, 
    ProductModule, 
    UserModule, 
    CategoryModule, 
    StatusModule, 
    OrderProductModule, 
    AuthModule,
    JwtModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {}
