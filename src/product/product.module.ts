import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDbRepository } from './repositories/product-db.repository';
import { ProductCacheRepository } from './repositories/product-cache.repository';
import { RateLimiterModule } from 'src/common/rate-limiter/rate-limiter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),RateLimiterModule],
  controllers: [ProductController],
  providers: [ProductService,
    ProductDbRepository,
    ProductCacheRepository,],
})
export class ProductModule {}
