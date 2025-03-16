import { confirmOrderProductMock } from '../../order-product/__mocks__/order-product.mock';
import { StatusType } from '../../status/enum/status-type.enum';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { OrderEntity } from '../entities/order.entity';

export const orderMock: OrderEntity = {
  id: 3,
  userId: userEntityMock.id,
  statusId: StatusType.Done,
  totalPrice: 100,
  orderProducts: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const confirmOrderMock: OrderEntity = {
  id: 3,
  userId: userEntityMock.id,
  statusId: StatusType.Done,
  totalPrice: 100,
  orderProducts: [confirmOrderProductMock],
  createdAt: new Date(),
  updatedAt: new Date(),
};