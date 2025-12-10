import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createOrderDto: any) {
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async findAll(filters?: any) {
    const query = this.orderModel.find();

    if (filters?.buyer) {
      query.where('buyer').equals(new Types.ObjectId(filters.buyer));
    }
    if (filters?.status) {
      query.where('status').equals(filters.status);
    }
    if (filters?.paymentStatus) {
      query.where('paymentStatus').equals(filters.paymentStatus);
    }

    return query.sort({ createdAt: -1 }).exec();
  }

  async findById(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate('buyer', 'email name phone')
      .populate('items.productId', 'name price')
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByBuyer(buyerId: string) {
    return this.orderModel
      .find({ buyer: new Types.ObjectId(buyerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateOrderDto: any) {
    const order = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    return this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    const validStatuses = ['unpaid', 'paid', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      throw new BadRequestException(`Invalid payment status: ${paymentStatus}`);
    }

    return this.orderModel
      .findByIdAndUpdate(id, { paymentStatus }, { new: true })
      .exec();
  }

  async delete(id: string) {
    const order = await this.orderModel.findByIdAndDelete(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrderStats() {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);
  }

  async searchOrders(searchTerm: string) {
    return this.orderModel
      .find({
        $or: [
          { _id: new Types.ObjectId(searchTerm).toString() },
          { 'shippingAddress.email': new RegExp(searchTerm, 'i') },
          { trackingNumber: new RegExp(searchTerm, 'i') },
        ],
      })
      .exec();
  }
}
