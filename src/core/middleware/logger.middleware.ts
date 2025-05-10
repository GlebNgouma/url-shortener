import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { statusCode } = res;
      const { method, url } = req;
      const logData = { method, url };
      const logMessage = `${method} ${url}`;

      if (statusCode === 500) {
        this.logger.error(logMessage, undefined, `HTTP`, logData);
      } else if (statusCode === 404) {
        this.logger.warn(logMessage, `HTTP`, logData);
      } else {
        this.logger.log(logMessage, `HTTP`, logData);
      }
    });
    next();
  }
}
