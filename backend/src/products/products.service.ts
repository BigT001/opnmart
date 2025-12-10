import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    console.log('[ProductsService] Constructor called - ProductsService initialized');
  }

  async create(createProductDto: any) {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(filters?: any) {
    const query = this.productModel.find();

    if (filters?.category) query.where('category').equals(filters.category);
    if (filters?.vendor) query.where('vendor').equals(filters.vendor);
    if (filters?.minPrice) query.where('price').gte(filters.minPrice);
    if (filters?.maxPrice) query.where('price').lte(filters.maxPrice);
    if (filters?.search) {
      query.where('name').regex(new RegExp(filters.search, 'i'));
    }

    const result = await query.exec();
    console.log(`[ProductsService.findAll] Query executed. Found ${result.length} products from database`);
    return result;
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: any) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async searchProducts(searchTerm: string) {
    return this.productModel
      .find({ $text: { $search: searchTerm } })
      .exec();
  }

  async getProductsByCategory(categoryId: string) {
    return this.productModel.find({ category: categoryId }).exec();
  }

  async getProductsByVendor(vendorId: string) {
    return this.productModel.find({ vendor: vendorId }).exec();
  }

  async updateStock(id: string, quantity: number) {
    return this.productModel
      .findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true })
      .exec();
  }
}
