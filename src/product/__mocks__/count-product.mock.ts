import { categoryMock } from '../../category/__mocks__/category.mock';
import { CountProductDto } from '../dtos/count-product.dto';

export const countProductMock: CountProductDto = {
  category_id: categoryMock.id,
  total_items: 4,
};