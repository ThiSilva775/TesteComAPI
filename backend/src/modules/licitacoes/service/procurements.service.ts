import { env } from '../../../config/env';
import { prisma } from '../../../database/prisma';
import { pncpClient } from '../../../integrations/pncp/pncpClient';
import { PncpProcurement } from '../../pncp/types/pncpProcurement.type';
import { procurementMapper } from '../mapper/procurement.mapper';
import { ListProcurementsQuery } from '../dto/listProcurements.dto';
import { ProcurementsRepository } from '../repository/procurements.repository';

export class ProcurementsService {
  constructor(private readonly repository = new ProcurementsRepository()) {}

  async syncByPublicationDate(startDate: string, endDate: string) {
    const syncLog = await prisma.syncLog.create({
      data: { resource: 'procurements', startedAt: new Date(), status: 'running' }
    });

    let page = 1;
    let totalFetched = 0;
    let totalSaved = 0;

    try {
      while (true) {
        const response = await pncpClient.getWithRetry<PncpProcurement>(env.PNCP_CONTRACTING_BY_DATE_PATH, {
          dataInicial: startDate,
          dataFinal: endDate,
          pagina: page,
          tamanhoPagina: 50
        });

        const mapped = (response.data ?? []).map(procurementMapper.fromPncp);
        await this.repository.upsertMany(mapped);

        totalFetched += response.data?.length ?? 0;
        totalSaved += mapped.length;

        const hasNext = response.paginasRestantes ? response.paginasRestantes > 0 : false;
        if (!hasNext || !response.data?.length) break;
        page += 1;
      }

      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          endedAt: new Date(),
          totalFetched,
          totalSaved,
          lastCursor: `${startDate}:${endDate}`
        }
      });

      return { totalFetched, totalSaved };
    } catch (error: any) {
      await prisma.syncLog.update({
        where: { id: syncLog.id },
        data: { status: 'error', endedAt: new Date(), message: error.message }
      });
      throw error;
    }
  }

  async incrementalSync() {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - env.SYNC_DEFAULT_DAYS_BACK);
    return this.syncByPublicationDate(start.toISOString().slice(0, 10), today.toISOString().slice(0, 10));
  }

  async list(query: ListProcurementsQuery) {
    return this.repository.list(query);
  }

  async dashboard() {
    return this.repository.dashboard();
  }
}

export const procurementsService = new ProcurementsService();
