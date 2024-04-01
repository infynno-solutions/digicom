import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from '@repo/shared';
import { IRequestWithUser } from 'src/auth/auth.interface';

@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/')
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: IRequestWithUser,
  ) {
    return this.productService.create(createProductDto, req.user);
  }
}
