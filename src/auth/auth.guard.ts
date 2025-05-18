import {
  CanActivate,
  ExecutionContext,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private apiKey: string;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // avant que la logique ne soit execute il va d'abord appele onModuleInit
    this.apiKey = this.configService.getOrThrow<string>('apiKey');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const uncheckedApiKey = request.headers['x-api-key'];
    if (uncheckedApiKey !== this.apiKey) {
      throw new UnauthorizedException(`Api Key n'est pas valide`);
    }
    return true;
  }
}
