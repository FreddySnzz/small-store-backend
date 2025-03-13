import { Module } from '@nestjs/common';

import { OrderProductService } from './order_product.service';

@Module({
  providers: [OrderProductService]
})
export class OrderProductModule {}
