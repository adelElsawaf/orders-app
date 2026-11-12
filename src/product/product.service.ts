import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { GetProductByIdResponseDto } from './dtos/responses/get-product-by-id.response.dto';
import { ProductMapper } from './mappers/product.mapper';
import { ProductNotFoundException } from './exceptions/product-not-found-exception';
import { CreateProductRequestDto } from './dtos/requests/create-product.request.dto';
import { CreateProductResponseDto } from './dtos/responses/create-product.response.dto';
import { REDIS_CLIENT } from '../common/redis/redis.constants';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_CACHE_KEY_PREFIX,
  PRODUCT_CACHE_TTL_SECONDS,
  REDIS_EXPIRATION_OPTION,
} from './redis/constants'; import Redis from 'ioredis';
import { UpdateProductRequestDto } from './dtos/requests/update-product.request.dto';
import { UpdateProductResponseDto } from './dtos/responses/update-product.response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) { }

  private buildProductCacheKey(productId: number): string {
    return `${PRODUCT_CACHE_KEY_PREFIX}:${productId}`;
  }

  private async getProductFromCache(
    productId: number,
  ): Promise<Product | null> {
    const cacheKey = this.buildProductCacheKey(productId)

    const cachedProduct = await this.redisClient.get(cacheKey);

    if (!cachedProduct) {
      return null;
    }

    return JSON.parse(cachedProduct) as Product;
  }

  private async setProductInCache(
    product: Product,
  ): Promise<void> {
    const cacheKey = this.buildProductCacheKey(product.id)

    await this.redisClient.set(
      cacheKey,
      JSON.stringify(product),
      REDIS_EXPIRATION_OPTION,
      PRODUCT_CACHE_TTL_SECONDS,
    );
  }

  private async deleteProductInCache(
    productId: number,
  ): Promise<void> {
    const cacheKey = this.buildProductCacheKey(productId)
    await this.redisClient.del(
      cacheKey,
    );
  }

  private async getProductFromDB(
    productId: number,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (product === null) {
      throw new ProductNotFoundException(productId);
    }

    return product;
  }

  async getProductById(
    productId: number,
  ): Promise<GetProductByIdResponseDto> {
    let product = await this.getProductFromCache(productId);

    if (product === null) {
      product = await this.getProductFromDB(productId);
      await this.setProductInCache(product);
    }
    return ProductMapper.toGetByIdResponse(product);
  }

  async createProduct(createProductRequestDto: CreateProductRequestDto): Promise<CreateProductResponseDto> {
    const product = this.productRepository.create(createProductRequestDto);
    await this.productRepository.save(product);
    return ProductMapper.toCreateResponse(product);
  }

  async updateProduct(productId: number, updateProductRequestDto: UpdateProductRequestDto): Promise<UpdateProductResponseDto> {
    const product = await this.getProductFromDB(productId);
    const updatedProduct = await this.productRepository.save({
      ...product,
      ...updateProductRequestDto,
    });
    this.deleteProductInCache(productId)
    return ProductMapper.toUpdateResponse(updatedProduct);
  }
}
