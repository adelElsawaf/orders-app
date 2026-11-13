import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from '../../common/redis/redis.constants';
import {
    PRODUCT_CACHE_KEY_PREFIX,
    PRODUCT_CACHE_TTL_SECONDS,
} from '../constants/product-cache.constants';

import { REDIS_EXPIRATION_OPTION } from '../constants/product-cache.constants';

import { Product } from '../product.entity';

@Injectable()
export class ProductCacheRepository {
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis

    private buildProductCacheKey(productId: number): string {
        return `${PRODUCT_CACHE_KEY_PREFIX}:${productId}`;
    }

    async getProductbyId(
        productId: number,
    ): Promise<Product | null> {
        const cacheKey = this.buildProductCacheKey(productId)

        const cachedProduct = await this.redisClient.get(cacheKey);

        if (!cachedProduct) {
            return null;
        }

        return JSON.parse(cachedProduct) as Product;
    }

    async setProduct(
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
    
    async deleteProductById(
        productId: number,
    ): Promise<void> {
        const cacheKey = this.buildProductCacheKey(productId)
        await this.redisClient.del(
            cacheKey,
        );
    }

}