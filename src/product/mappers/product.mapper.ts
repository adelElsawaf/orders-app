import { Product } from '../product.entity';
import { ProductResponseDto } from '../dtos/responses/product-response.dto';
import { GetProductByIdResponseDto } from '../dtos/responses/get-product-by-id.response.dto';
import { CreateProductResponseDto } from '../dtos/responses/create-product.response.dto';

export class ProductMapper {
  static toProductResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      publishingStatus: product.publishingStatus,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toGetByIdResponse(product: Product): GetProductByIdResponseDto {
    return {
      ...this.toProductResponse(product),
    };
  }

  static toCreateResponse(product: Product): CreateProductResponseDto {
    return {
      ...this.toProductResponse(product),
    };
  }
  static toUpdateResponse(product: Product): CreateProductResponseDto {
    return {
      ...this.toProductResponse(product),
    };
  }
}
