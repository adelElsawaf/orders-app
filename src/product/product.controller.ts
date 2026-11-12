import { Controller, Get, Param ,Post, Body, Patch} from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductByIdResponseDto } from './dtos/responses/get-product-by-id.response.dto';
import { GetProductByIdRequestDto } from './dtos/requests/get-product-by-id.request.dto';
import { CreateProductRequestDto } from './dtos/requests/create-product.request.dto';
import { CreateProductResponseDto } from './dtos/responses/create-product.response.dto';
import { UpdateProductRequestDto } from './dtos/requests/update-product.request.dto';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':productId')
  getProductById(
    @Param() getProductByIdDto: GetProductByIdRequestDto,
  ): Promise<GetProductByIdResponseDto> {
    return this.productService.getProductById(getProductByIdDto.productId);
  }

  @Post()
  createProduct(
    @Body() createProductRequestDto: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    return this.productService.createProduct(createProductRequestDto);
  }

  @Patch(':productId')
  async updateProduct(
    @Param('productId')
     productId: number,
    @Body() updateProductRequestDto: UpdateProductRequestDto,
  ): Promise<GetProductByIdResponseDto> {
    return this.productService.updateProduct(
      productId,
      updateProductRequestDto,
    );
  }
}
