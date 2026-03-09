import { Router } from 'express';
import { procurementsService } from '../../licitacoes/service/procurements.service';

export const dashboardRouter = Router();

dashboardRouter.get('/', async (_req, res) => {
  const data = await procurementsService.dashboard();
  res.json(data);
});
