import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop({ type: String, ref: 'Category', default: null })
  parentCategory?: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  slug: string;

  @Prop({ type: Object })
  metadata?: any;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
