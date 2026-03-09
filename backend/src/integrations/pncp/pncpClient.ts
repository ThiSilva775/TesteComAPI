import axios, { AxiosInstance } from 'axios';
import { env } from '../../config/env';

export interface PncpPagedResponse<T> {
  data: T[];
  totalRegistros?: number;
  totalPaginas?: number;
  numeroPagina?: number;
  paginasRestantes?: number;
  empty?: boolean;
}

export class PncpClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: env.PNCP_BASE_URL,
      timeout: env.PNCP_TIMEOUT_MS
    });
  }

  async getWithRetry<T>(path: string, params: Record<string, unknown>, maxRetries = 3): Promise<PncpPagedResponse<T>> {
    let retries = 0;
    while (true) {
      try {
        const response = await this.http.get<PncpPagedResponse<T>>(path, { params });
        return response.data;
      } catch (error) {
        retries += 1;
        if (retries >= maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, retries * 500));
      }
    }
  }
}

export const pncpClient = new PncpClient();
