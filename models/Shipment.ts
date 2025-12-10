import mongoose, { Schema, Document } from 'mongoose';

export interface IShipment extends Document {
  orderId: string;
  sendboxId: string;
  trackingNumber: string;
  status: string;
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    location?: {
      lat: number;
      lng: number;
      address: string;
      state: string;
    };
  }>;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
    state: string;
  };
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  carrier: string;
  weight: number;
  origin: string;
  destination: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  originAddress: string;
  destinationAddress: string;
  items?: Array<{
    name: string;
    quantity: number;
    weight: number;
  }>;
  errorMessage?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    sendboxId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'cancelled', 'exception'],
      default: 'created',
      index: true,
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        location: {
          lat: Number,
          lng: Number,
          address: String,
          state: String,
        },
      },
    ],
    currentLocation: {
      lat: Number,
      lng: Number,
      address: String,
      state: String,
    },
    estimatedDelivery: Date,
    deliveredAt: Date,
    carrier: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: String,
    originAddress: {
      type: String,
      required: true,
    },
    destinationAddress: {
      type: String,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        weight: Number,
      },
    ],
    errorMessage: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
shipmentSchema.index({ orderId: 1, createdAt: -1 });
shipmentSchema.index({ status: 1, createdAt: -1 });
shipmentSchema.index({ createdAt: -1 });

// Virtual for tracking link
shipmentSchema.virtual('trackingLink').get(function (this: IShipment) {
  return `https://tracking.sendbox.co/${this.trackingNumber}`;
});

// Method to update status
shipmentSchema.methods.updateStatus = function (newStatus: string, location?: any) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    location,
  });
  if (location) {
    this.currentLocation = location;
  }
};

// Method to mark as delivered
shipmentSchema.methods.markAsDelivered = function () {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  this.statusHistory.push({
    status: 'delivered',
    timestamp: new Date(),
  });
};

// Static method to find by tracking number
shipmentSchema.statics.findByTracking = function (trackingNumber: string) {
  return this.findOne({ trackingNumber });
};

// Static method to find by order ID
shipmentSchema.statics.findByOrder = function (orderId: string) {
  return this.find({ orderId }).sort({ createdAt: -1 });
};

export default mongoose.models.Shipment || mongoose.model<IShipment>('Shipment', shipmentSchema);
