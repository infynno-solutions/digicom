import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Get('/')
  listProducts(@Req() req: IRequestWithUser, @Query('page') page: number) {
    return this.productService.list({
      user: req.user,
      page,
    });
  }

  @Get('/:id')
  getProduct(@Req() req: IRequestWithUser, @Param('id') id: string) {
    return this.productService.get({ user: req.user, id });
  }
}
