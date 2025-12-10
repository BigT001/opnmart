import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filters: any) {
    return this.ordersService.findAll(filters);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Req() req: any) {
    return this.ordersService.findByBuyer(req.user.id);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query('q') searchTerm: string) {
    return this.ordersService.searchOrders(searchTerm);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Put(':id/payment-status')
  @UseGuards(JwtAuthGuard)
  updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: string) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
