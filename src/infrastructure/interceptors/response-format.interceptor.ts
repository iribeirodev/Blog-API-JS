import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

/**
 * O interceptor verifica o status da resposta e o tipo de data
 * Se a resposta já está no formato ApiResponse, ela é retornada diretamente
 * Senão, a resposta é transformada em um objeto ApiResponse.
 */
/**
 * Interceptor para formatar as respostas no padrão ApiResponse
 */
@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const status = context.switchToHttp().getResponse().statusCode;

        // Retorna no formato ApiResponse
        return {
          message: status === 200 ? null : 'Erro na requisição',
          data: Array.isArray(data) ? data : data ? [data] : [],
          status,
        };
      }),
    );
  }
}