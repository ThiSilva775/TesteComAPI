import { KpiCard } from '../components/KpiCard';
import { getDashboard, getProcurements } from '../lib/api';

export default async function HomePage() {
  const [dashboard, procurements] = await Promise.all([getDashboard(), getProcurements()]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">Monitor PNCP</h1>
      <p className="mt-2 text-slate-600">Painel inicial de monitoramento de contratações, atas e contratos.</p>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Licitações monitoradas" value={dashboard.total ?? 0} />
        <KpiCard title="Contratações em aberto" value={dashboard.open ?? 0} />
        <KpiCard title="Total de registros recentes" value={procurements.totalRegistros ?? 0} />
      </section>

      <section className="mt-8 rounded-lg bg-white p-4 shadow">
        <h2 className="text-xl font-semibold">Últimas contratações sincronizadas</h2>
        <ul className="mt-4 space-y-3">
          {procurements.data?.map((item: any) => (
            <li key={item.id} className="rounded border border-slate-200 p-3">
              <p className="font-medium">{item.title ?? 'Sem título'}</p>
              <p className="text-sm text-slate-500">PNCP: {item.pncpControlNumber}</p>
              <p className="text-sm text-slate-500">Modalidade: {item.modalityDescription ?? 'Não informada'}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
