import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IBuyer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phonePrefix: string;
  password: string;
  addresses: {
    id: number;
    type: string;
    address: string;
    phone: string;
    default: boolean;
  }[];
  wishlists: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const BuyerSchema = new Schema<IBuyer>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [
        /^[0-9]{10}$/,
        'Phone number must be 10 digits (without country code)',
      ],
    },
    phonePrefix: {
      type: String,
      default: '+234',
      enum: ['+234', '+1', '+44', '+91', '+86', '+81', '+33', '+49', '+39', '+34', '+61'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    addresses: [
      {
        id: Number,
        type: String,
        address: String,
        phone: String,
        default: Boolean,
      },
    ],
    wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
BuyerSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

// Method to compare password
BuyerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export default mongoose.models.Buyer || mongoose.model<IBuyer>('Buyer', BuyerSchema);
