import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string; // Cloudinary URL
  imagePublicId?: string; // Cloudinary public ID for updates/deletions
  rating?: number;
  reviews?: number;
  badge?: string;
  condition: string;
  stock: number;
  sold?: number;
  specifications?: Record<string, any>; // Dynamic specifications based on category
  vendorId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['electronics', 'appliances', 'furniture', 'grocery'],
    },
    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imagePublicId: {
      type: String,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    badge: {
      type: String,
      enum: ['Hot Deal', 'Best Seller', 'Premium', 'Sale', 'New Arrival', null],
      default: null,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Brand New', 'Like New', 'Refurbished', 'Used'],
      default: 'Brand New',
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    specifications: {
      type: Schema.Types.Mixed,
      default: {},
    },
    vendorId: {
      type: String,
      required: [true, 'Vendor ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
