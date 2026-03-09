import { config } from 'dotenv';
import { z } from 'zod';

config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  PNCP_BASE_URL: z.string().url().default('https://pncp.gov.br/api/consulta'),
  PNCP_TIMEOUT_MS: z.coerce.number().default(15000),
  PNCP_CONTRACTING_BY_DATE_PATH: z.string().default('/v1/contratacoes/publicacao'),
  PNCP_OPEN_PROPOSALS_PATH: z.string().default('/v1/contratacoes/proposta-aberta'),
  PNCP_ACTS_PATH: z.string().default('/v1/atas'),
  PNCP_CONTRACTS_PATH: z.string().default('/v1/contratos/publicacao'),
  SYNC_DEFAULT_DAYS_BACK: z.coerce.number().default(3)
});

export const env = schema.parse(process.env);
