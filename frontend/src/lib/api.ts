const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Erro ao carregar dashboard');
  return response.json();
}

export async function getProcurements() {
  const response = await fetch(`${API_BASE_URL}/api/procurements?limit=10&page=1`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Erro ao carregar contratações');
  return response.json();
}

export async function getProcurementDetail(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/procurements/${id}`, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
