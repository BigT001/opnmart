import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    // Vendor Type
    vendorType: {
      type: String,
      enum: ['individual', 'business'],
      required: [true, 'Vendor type is required'],
      default: 'individual',
    },

    // Common fields for both types
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password by default in queries
    },
    businessCategory: {
      type: String,
      trim: true,
    },
    businessCategories: {
      type: [String],
      default: [],
    },

    // Individual Vendor Fields
    fullName: {
      type: String,
      trim: true,
    },
    ninNumber: {
      type: String,
      trim: true,
    },
    idType: {
      type: String,
      trim: true,
    },
    storeName: {
      type: String,
      trim: true,
      minlength: [3, 'Store name must be at least 3 characters'],
      maxlength: [100, 'Store name must not exceed 100 characters'],
    },

    // Business Vendor Fields
    businessLegalName: {
      type: String,
      trim: true,
    },
    tradingName: {
      type: String,
      trim: true,
    },
    businessEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      trim: true,
    },
    businessRegistration: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tinNumber: {
      type: String,
      trim: true,
    },
    businessWebsite: {
      type: String,
      trim: true,
    },
    yearsInOperation: {
      type: Number,
      default: 0,
    },
    repFullName: {
      type: String,
      trim: true,
    },
    repEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    repPhone: {
      type: String,
      trim: true,
    },
    repPosition: {
      type: String,
      trim: true,
    },

    // Bank Information (optional for business vendors)
    bankName: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    bvn: {
      type: String,
      trim: true,
    },

    // Address Information
    businessAddress: {
      type: String,
      trim: true,
    },
    headOfficeAddress: {
      type: String,
      trim: true,
    },
    warehouseAddress: {
      type: String,
      trim: true,
    },
    pickupAddress: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: 'Nigeria',
      },
    },

    // Store Settings
    storeLogo: {
      type: String,
      default: null,
    },
    storeDescription: {
      type: String,
      maxlength: [1000, 'Store description must not exceed 1000 characters'],
    },
    businessDescription: {
      type: String,
      maxlength: [500, 'Business description must not exceed 500 characters'],
    },
    storeRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Metrics
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },

    // Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
