
import { Injectable } from '@nestjs/common';

import { Product } from './product.entity';

import { ProductDbRepository } from './repositories/product-db.repository';
import { ProductCacheRepository } from './repositories/product-cache.repository';

import { ProductMapper } from './mappers/product.mapper';
import { ProductNotFoundException } from './exceptions/product-not-found-exception';

import { GetProductByIdResponseDto } from './dtos/responses/get-product-by-id.response.dto';
import { CreateProductRequestDto } from './dtos/requests/create-product.request.dto';
import { CreateProductResponseDto } from './dtos/responses/create-product.response.dto';
import { UpdateProductRequestDto } from './dtos/requests/update-product.request.dto';
import { UpdateProductResponseDto } from './dtos/responses/update-product.response.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productDbRepository: ProductDbRepository,
    private readonly productCacheRepository: ProductCacheRepository,
  ) {}

  private async getProductFromDB(
    productId: number,
  ): Promise<Product> {
    const product = await this.productDbRepository.findById(productId);

    if (product === null) {
      throw new ProductNotFoundException(productId);
    }

    return product;
  }

  async getProductById(
    productId: number,
  ): Promise<GetProductByIdResponseDto> {
    let product = await this.productCacheRepository.getProductbyId(productId);

    if (product === null) {
      product = await this.getProductFromDB(productId);
      await this.productCacheRepository.setProduct(product);
    }

    return ProductMapper.toGetByIdResponse(product);
  }

  async createProduct(
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    const product = this.productDbRepository.save(createProductRequestDto);

    return ProductMapper.toCreateResponse(await product);
  }

  async updateProduct(
    productId: number,
    updateProductRequestDto: UpdateProductRequestDto,
  ): Promise<UpdateProductResponseDto> {
    const product = await this.getProductFromDB(productId);

    const updatedProduct = await this.productDbRepository.save({
      ...product,
      ...updateProductRequestDto,
    });

    await this.productCacheRepository.deleteProductById(productId);

    return ProductMapper.toUpdateResponse(updatedProduct);
  }
}
