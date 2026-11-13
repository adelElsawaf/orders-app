import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../product.entity';

@Injectable()
export class ProductDbRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findById(productId: number): Promise<Product | null> {
    return this.repository.findOne({
      where: { id: productId },
    });
  }

  async save(
    createProductData: Partial<Product>,
  ): Promise<Product> {
    const product = this.repository.create(createProductData);
    return this.repository.save(product);
  }
}