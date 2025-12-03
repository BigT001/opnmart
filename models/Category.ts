/**
 * Category Schema
 * Stores main categories (Electronics, Appliances, etc.)
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  icon: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
categorySchema.index({ isActive: 1 });
categorySchema.index({ displayOrder: 1 });

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
