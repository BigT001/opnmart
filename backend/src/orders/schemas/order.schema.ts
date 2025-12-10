import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyer: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],
    required: true,
  })
  items: any[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  shippingCost: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ required: true })
  total: number;

  @Prop({
    type: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    required: true,
  })
  shippingAddress: any;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  })
  paymentStatus: string;

  @Prop()
  paymentMethod: string;

  @Prop()
  paymentReference?: string;

  @Prop()
  trackingNumber?: string;

  @Prop({ type: Object })
  metadata?: any;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
