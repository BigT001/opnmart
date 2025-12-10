import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ enum: ['buyer', 'vendor', 'admin'], default: 'buyer' })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  verificationCode: string;

  @Prop({ default: null })
  verificationCodeExpiry: Date;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
