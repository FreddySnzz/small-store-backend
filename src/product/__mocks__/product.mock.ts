import { categoryMock } from "../../category/__mocks__/category.mock";
import { ProductEntity } from "../entities/product.entity";

export const productMock: ProductEntity = {
  categoryId: categoryMock.id,
  id: 123,
  imageUrl: "http://image.com",
  description: "Um livro muito legal",
  name: "Alice no país das maravilhas",
  price: 34.99,
  stockAmount: 10,
  createdAt: new Date(),
  updatedAt: new Date()
}