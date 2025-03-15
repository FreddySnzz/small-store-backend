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

import { OrderService } from './order.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { UserId } from '../decorators/user-id.decorator';
import { AddProductDto } from '../product/dtos/add-product.dto';
import { ReturnOrderDto } from './dtos/return-order.dto';
import { OrderEntity } from './entities/order.entity';

@Roles(UserType.Admin, UserType.User)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Get()
  async getAllOrders(
    @Query('statusId') statusId?: number,
    @UserId() userId?: number
  ): Promise<ReturnOrderDto[]> {
    return (await this.orderService.getAllOrders(
      userId, 
      statusId
    )).map(
      (order) => new ReturnOrderDto(order)
    );
  };

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() addProduct: AddProductDto[],
    @UserId() userId: number
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      await this.orderService.createOrder(
        addProduct, 
        userId
      )
    );
  };

  @Roles(UserType.Admin)
  @Get('/:orderId')
  async findOrderById(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      await this.orderService.findOrderById(
        orderId
      )
    );
  };

  @Get('/confirm/:orderId')
  async confirmOrder(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      await this.orderService.confirmOrder(
        orderId
      )
    );
  };

  @Get('/cancel/:orderId')
  async cancelOrder(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      await this.orderService.cancelOrder(
        orderId
      )
    );
  };
}
