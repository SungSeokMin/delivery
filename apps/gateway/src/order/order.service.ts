import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE, UserMeta, UserPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientProxy,
  ) {}

  createOrder(createOrderDto: CreateOrderDto, userPayload: UserPayloadDto) {
    return this.orderMicroservice.send<any, CreateOrderDto & UserMeta>(
      { cmd: 'create_order' },
      { ...createOrderDto, meta: { user: userPayload } },
    );
  }
}
