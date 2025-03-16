import { orderMock } from '../../order/__mocks__/order.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { OrderProductEntity } from '../entities/order-product.entity';

export const orderProductMock: OrderProductEntity = {
  id: 45543,
  amount: 4,
  price: 219.6,
  orderId: 3,
  productId: productMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const confirmOrderProductMock: OrderProductEntity = {
  id: 45543,
  amount: 4,
  price: 219.6,
  orderId: 3,
  productId: productMock.id,
  product: productMock,
  createdAt: new Date(),
  updatedAt: new Date(),
};