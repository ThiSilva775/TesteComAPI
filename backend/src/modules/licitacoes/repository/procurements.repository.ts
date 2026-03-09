import { Prisma } from '@prisma/client';
import { prisma } from '../../../database/prisma';
import { ListProcurementsQuery } from '../dto/listProcurements.dto';

export class ProcurementsRepository {
  async upsertMany(entries: Array<any>) {
    for (const entry of entries) {
      const organization = entry.organization
        ? await prisma.organization.upsert({
            where: { cnpj: entry.organization.cnpj },
            update: { name: entry.organization.name, localRaw: entry.organization },
            create: { cnpj: entry.organization.cnpj, name: entry.organization.name, localRaw: entry.organization }
          })
        : null;

      await prisma.procurement.upsert({
        where: { pncpControlNumber: entry.pncpControlNumber },
        update: { ...entry, organizationId: organization?.id ?? null },
        create: { ...entry, organizationId: organization?.id ?? null }
      });
    }
  }

  async list(query: ListProcurementsQuery) {
    const where: Prisma.ProcurementWhereInput = {
      modalityCode: query.modalityCode,
      situationCode: query.situationCode,
      publicationDate:
        query.startDate || query.endDate
          ? {
              gte: query.startDate ? new Date(query.startDate) : undefined,
              lte: query.endDate ? new Date(query.endDate) : undefined
            }
          : undefined,
      OR: query.keyword
        ? [{ title: { contains: query.keyword, mode: 'insensitive' } }, { pncpControlNumber: { contains: query.keyword } }]
        : undefined,
      organization: query.cnpj ? { cnpj: query.cnpj } : undefined
    };

    const [total, records] = await Promise.all([
      prisma.procurement.count({ where }),
      prisma.procurement.findMany({
        where,
        include: { organization: true },
        orderBy: { publicationDate: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      })
    ]);

    return { total, records };
  }

  async findById(id: string) {
    return prisma.procurement.findUnique({
      where: { id },
      include: { organization: true, documents: true }
    });
  }

  async dashboard() {
    const [total, open, byModality, bySituation] = await Promise.all([
      prisma.procurement.count(),
      prisma.procurement.count({ where: { isOpen: true } }),
      prisma.procurement.groupBy({ by: ['modalityDescription'], _count: { _all: true } }),
      prisma.procurement.groupBy({ by: ['situationDescription'], _count: { _all: true } })
    ]);

    return { total, open, byModality, bySituation };
  }
}
