import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MakePaymentDto } from './dto/make-payment.dto';
import { RpcInterceptor } from '@app/common';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'make_payment' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  makePayment(@Payload() payload: MakePaymentDto) {
    return this.paymentService.makePayment(payload);
  }
}
