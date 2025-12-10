import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() filters: any) {
    console.log('[ProductsController.findAll] GET /products called', filters);
    const result = this.productsService.findAll(filters);
    console.log('[ProductsController.findAll] Returning result from service');
    return result;
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.productsService.searchProducts(searchTerm);
  }

  @Get('category/:categoryId')
  getByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.getProductsByCategory(categoryId);
  }

  @Get('vendor/:vendorId')
  getByVendor(@Param('vendorId') vendorId: string) {
    return this.productsService.getProductsByVendor(vendorId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }

  @Put(':id/stock')
  @UseGuards(JwtAuthGuard)
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.productsService.updateStock(id, quantity);
  }
}
