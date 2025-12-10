import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discountPrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, ref: 'Category' })
  category: string;

  @Prop({ type: String, ref: 'Vendor' })
  vendor: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({ type: Object, default: {} })
  specifications: Record<string, any>;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
