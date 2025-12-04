import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    // Basic Information
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      minlength: [3, 'Store name must be at least 3 characters'],
      maxlength: [100, 'Store name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password by default in queries
    },

    // Business Information
    businessRegistration: {
      type: String,
      required: [true, 'Business registration number is required'],
      unique: true,
      trim: true,
    },
    businessCategory: {
      type: String,
      required: [true, 'Business category is required'],
      enum: [
        'Electronics',
        'Fashion & Clothing',
        'Home & Garden',
        'Sports & Outdoors',
        'Books & Media',
        'Health & Beauty',
        'Toys & Games',
        'Food & Beverages',
        'Automotive',
        'Other',
      ],
    },
    businessDescription: {
      type: String,
      maxlength: [500, 'Business description must not exceed 500 characters'],
    },

    // Bank Account Information
    bankAccount: {
      accountName: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true,
      },
      accountNumber: {
        type: String,
        required: [true, 'Account number is required'],
        trim: true,
      },
      bankName: {
        type: String,
        required: [true, 'Bank name is required'],
        trim: true,
      },
      bankCode: {
        type: String,
        required: [true, 'Bank code is required'],
        trim: true,
      },
    },

    // Address Information
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'Nigeria',
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
      },
    },

    // Store Settings
    storeLogo: {
      type: String, // URL to logo image
      default: null,
    },
    storeDescription: {
      type: String,
      maxlength: [1000, 'Store description must not exceed 1000 characters'],
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

// Update the updatedAt field before saving
vendorSchema.pre('save', function (next: any) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
