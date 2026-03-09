import { env } from '../../../config/env';
import { prisma } from '../../../database/prisma';
import { pncpClient } from '../../../integrations/pncp/pncpClient';
import { PncpProcurement } from '../../pncp/types/pncpProcurement.type';
import { procurementMapper } from '../mapper/procurement.mapper';
import { ListProcurementsQuery } from '../dto/listProcurements.dto';
import { ProcurementsRepository } from '../repository/procurements.repository';

export class ProcurementsService {
  constructor(private readonly repository = new ProcurementsRepository()) {}

  async syncByPublicationDate(startDate: string, endDate: string, cnpj?: string) {
    const syncLog = await prisma.syncLog.create({
      data: { resource: 'procurements', startedAt: new Date(), status: 'running' }
    });

    let page = 1;
    let totalFetched = 0;
    let totalSaved = 0;

    try {
      while (true) {
        const params: any = {
          dataInicial: startDate,
          dataFinal: endDate,
          pagina: page,
          tamanhoPagina: 50
        };

        if (cnpj) {
          params.cnpj = cnpj;
        }

        const response = await pncpClient.getWithRetry<PncpProcurement>(env.PNCP_CONTRACTING_BY_DATE_PATH, params);

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
          lastCursor: `${startDate}:${endDate}${cnpj ? `:${cnpj}` : ''}`
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
    // Syncing data for Prefeitura Municipal de Niquelândia-GO
    const cnpj = '02.215.895/0001-07';
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    return this.syncByPublicationDate(startDate, endDate, cnpj);
  }

  async list(query: ListProcurementsQuery) {
    return this.repository.list(query);
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async dashboard() {
    return this.repository.dashboard();
  }
}

export const procurementsService = new ProcurementsService();
