import { Request, Response, Router } from 'express';
import { listProcurementsSchema } from '../dto/listProcurements.dto';
import { procurementsService } from '../service/procurements.service';

export const procurementsRouter = Router();

procurementsRouter.get('/', async (req: Request, res: Response) => {
  const query = listProcurementsSchema.parse(req.query);
  const result = await procurementsService.list(query);

  return res.json({
    data: result.records,
    totalRegistros: result.total,
    numeroPagina: query.page,
    totalPaginas: Math.ceil(result.total / query.limit)
  });
});

procurementsRouter.post('/sync', async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body as { startDate: string; endDate: string };
  const result = await procurementsService.syncByPublicationDate(startDate, endDate);
  return res.json(result);
});
