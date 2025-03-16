import { ReturnProductDto } from "../dtos/return-product.dto";

export const returnProductMock: ReturnProductDto = {
  id: 123,
  imageUrl: "http://image.com",
  description: "Um livro muito legal",
  name: "Alice no país das maravilhas",
  price: 34.99,
  stockAmount: 10,
}