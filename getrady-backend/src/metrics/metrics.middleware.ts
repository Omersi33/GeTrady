import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';
import { Request, Response, NextFunction } from 'express';

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'route', 'status'] as const,
});

const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const diffNs = Number(process.hrtime.bigint() - start);
      const durationSec = diffNs / 1e9;

      const route = (req as any).route?.path || req.path || 'unknown';
      const labels = {
        method: req.method,
        route,
        status: String(res.statusCode),
      };

      httpRequestsTotal.inc(labels);
      httpRequestDurationSeconds.observe(labels, durationSec);
    });

    next();
  }
}

register.setDefaultLabels({ app: 'getrady-backend' });
require('prom-client').collectDefaultMetrics();