/**
 * Filter Schema
 * Stores available filters for categories/subcategories
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface IFilter extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  categoryId?: string;
  subcategoryId?: string;
  name: string;
  type: 'text' | 'select' | 'range' | 'checkbox' | 'radio';
  options: IFilterOption[];
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const filterOptionSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const filterSchema = new Schema<IFilter>(
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
      lowercase: true,
      trim: true,
    },
    subcategoryId: {
      type: String,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'select', 'range', 'checkbox', 'radio'],
      default: 'select',
    },
    options: [filterOptionSchema],
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
filterSchema.index({ categoryId: 1 });
filterSchema.index({ subcategoryId: 1 });
filterSchema.index({ isActive: 1 });

export const Filter: Model<IFilter> =
  mongoose.models.Filter || mongoose.model<IFilter>('Filter', filterSchema);
