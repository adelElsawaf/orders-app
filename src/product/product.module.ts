import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductDbRepository } from './repositories/product-db.repository';
import { ProductCacheRepository } from './repositories/product-cache.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService,
    ProductDbRepository,
    ProductCacheRepository,],
})
export class ProductModule {}
