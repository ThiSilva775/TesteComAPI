import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import { ZodError } from 'zod';
import { logger } from './common/logger';
import { dashboardRouter } from './modules/dashboard/controller/dashboard.controller';
import { procurementsRouter } from './modules/licitacoes/controller/procurements.controller';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/procurements', procurementsRouter);
  app.use('/api/dashboard', dashboardRouter);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Validation error', issues: err.issues });
    }

    logger.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
