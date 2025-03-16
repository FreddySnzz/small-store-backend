import { UpdateProductDto } from "../dtos/update-product.dto";

export const updateProductMock: UpdateProductDto = {
  categoryId: 1,
  name: "Alice no país das travessuras",
  imageUrl: "http://image1.com",
  price: 59.99,
  stockAmount: 12,
  description: "Um livro muito legal"
}