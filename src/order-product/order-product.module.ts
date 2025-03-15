import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderProductService } from './order-product.service';
import { OrderProductEntity } from './entities/order-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderProductEntity])
  ],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
