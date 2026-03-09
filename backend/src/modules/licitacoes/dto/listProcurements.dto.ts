import { z } from 'zod';

export const listProcurementsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  cnpj: z.string().optional(),
  modalityCode: z.string().optional(),
  situationCode: z.string().optional(),
  keyword: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type ListProcurementsQuery = z.infer<typeof listProcurementsSchema>;
