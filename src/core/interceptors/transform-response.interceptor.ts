import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //Pipe: aura  acces a la reponse de chaque demande, par exemple va obtenir la chaine hello world renvoyée par le controller
    //Map: va transformer la reponse de chaque demande, par exemple va transformer la chaine hello world en un objet json {message: hello world}
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return { data: [] };
        }
        if (response.data && response.meta) {
          return {
            data: response.data,
            meta: response.meta,
          };
        }
        return { data: response };
      }),
    );
  }
}
