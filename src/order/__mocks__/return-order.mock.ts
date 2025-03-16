import { ReturnOrderDto } from '../dtos/return-order.dto';

export const returnOrderMock: ReturnOrderDto = {
  id: 3,
  user: undefined,
  status: undefined,
  createdAt: new Date(),
  totalPrice: 100,
  orderProducts: [],
};