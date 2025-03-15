import { 
  Injectable, 
  NestMiddleware, 
  Logger 
} from '@nestjs/common';
import { 
  Request, 
  Response, 
  NextFunction 
} from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { 
        method, 
        originalUrl, 
        ip, 
        headers, 
        query, 
        body 
      } = req;
      const { statusCode } = res;

      if (statusCode >= 500) {
        this.logger.error(`[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - IP: ${ip}`, JSON.stringify(body));
      } else if (statusCode >= 400) {
        this.logger.warn(`[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - IP: ${ip}`);
      } else {
        this.logger.log(`[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - IP: ${ip}`);
      };

      this.logger.debug(`Headers: ${JSON.stringify(headers)}`);
      this.logger.verbose(`Query Params: ${JSON.stringify(query)}`);
    });

    next();
  }
}
