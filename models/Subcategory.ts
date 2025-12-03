/**
 * Subcategory Schema
 * Stores subcategories for each main category
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubcategory extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  categoryId: string;
  name: string;
  icon: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
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
subcategorySchema.index({ categoryId: 1 });
subcategorySchema.index({ isActive: 1 });
subcategorySchema.index({ categoryId: 1, displayOrder: 1 });

export const Subcategory: Model<ISubcategory> =
  mongoose.models.Subcategory || mongoose.model<ISubcategory>('Subcategory', subcategorySchema);
