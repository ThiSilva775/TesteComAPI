export function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
