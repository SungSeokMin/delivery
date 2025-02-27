import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, address, payment } = createOrderDto;

    // 사용자 정보 가져오기
    const user = await this.getUserFromToken(token);

    // 상품 정보 가져오기
    const products = await this.getProductsByIds(productIds);

    // 총 금액 계산하기

    // 금액 검증하기

    // 주문 생성하기

    // 결제 시도하기

    // 주문 상태 업데이트하기

    // 결과 반환하기
  }

  async getUserFromToken(token: string) {
    // User MS : JWT 토큰 검증
    const tokenResponse = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (tokenResponse.status === 'error') {
      throw new PaymentCancelledException(tokenResponse);
    }

    // User MS : 사용자 정보 가져오기
    const userId = tokenResponse.data.sub;
    const userResponse = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (userResponse.status === 'error') {
      throw new PaymentCancelledException(userResponse);
    }

    return userResponse.data;
  }

  async getProductsByIds(productIds: string[]) {
    const response = await lastValueFrom(
      this.productService.send({ cmd: 'get_products_info' }, { productIds }),
    );

    if (response.status == 'error') {
      throw new PaymentCancelledException('상품 정보가 잘못됐습니다.');
    }

    return response.data.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }
}
