import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from '@repo/shared';
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
  listProducts(
    @Req() req: IRequestWithUser,
    @Query('page') page: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('search') search: string,
  ) {
    return this.productService.list({
      user: req.user,
      page,
      order,
      orderBy,
      search,
    });
  }

  @Get('/:id')
  getProduct(@Req() req: IRequestWithUser, @Param('id') id: string) {
    return this.productService.get({ user: req.user, id });
  }

  @Patch('/:id')
  updateProduct(
    @Req() req: IRequestWithUser,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto, req.user);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
