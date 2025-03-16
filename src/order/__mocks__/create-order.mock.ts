import { userEntityMock } from "../../user/__mocks__/user.mock";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { StatusType } from "../../status/enum/status-type.enum";

export const createOrderMock: CreateOrderDto = {
  userId: userEntityMock.id,
  statusId: StatusType.Done,
  totalPrice: 100,
};