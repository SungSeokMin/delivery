import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class RpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const response = {
          status: 'success',
          data,
        };

        console.log(response);

        return response;
      }),
      catchError((error) => {
        const response = {
          status: 'error',
          error,
        };

        console.log(response);

        return throwError(() => new RpcException(error));
      }),
    );
  }
}
