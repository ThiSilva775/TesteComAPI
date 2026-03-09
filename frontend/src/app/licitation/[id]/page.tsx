import Link from 'next/link';
import { getProcurementDetail } from '../../../lib/api';

export default async function ProcurementDetailPage({ params }: { params: { id: string } }) {
  const procurement = await getProcurementDetail(params.id);

  if (!procurement) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-2xl font-bold text-red-600">Licitação não encontrada</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Voltar para lista
        </Link>
      </main>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não informada';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Não informada';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = procurement.proposalEndDate
    ? new Date(procurement.proposalEndDate) < new Date()
    : false;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Voltar para lista
      </Link>

      {/* Header com Status */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{procurement.title || 'Sem título'}</h1>
            <p className="mt-2 text-lg text-gray-600">Número PNCP: {procurement.pncpControlNumber}</p>
          </div>
          <div className="ml-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              procurement.isOpen && !isExpired
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {procurement.isOpen && !isExpired ? '🟢 Aberta' : '🔴 Encerrada'}
            </span>
          </div>
        </div>
      </div>

      {/* Informações Principais */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Coluna 1 */}
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Informações Gerais</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Número do Processo</p>
                <p className="text-lg font-mono">{procurement.procurementNumber || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ano da Licitação</p>
                <p className="text-lg">{procurement.year || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Modalidade</p>
                <p className="text-lg">{procurement.modalityDescription || 'Não informada'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Situação</p>
                <p className="text-lg">{procurement.situationDescription || 'Não informada'}</p>
              </div>
            </div>
          </div>

          {/* Organização */}
          {procurement.organization && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🏛️ Órgão Responsável</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="text-lg font-semibold">{procurement.organization.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CNPJ</p>
                  <p className="text-lg font-mono">{procurement.organization.cnpj}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          {/* Datas */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Cronograma</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Publicação</p>
                  <p className="text-lg">{formatDate(procurement.publicationDate)}</p>
                </div>
              </div>

              {procurement.proposalStartDate && (
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Início das Propostas</p>
                    <p className="text-lg">{formatDateTime(procurement.proposalStartDate)}</p>
                  </div>
                </div>
              )}

              {procurement.proposalEndDate && (
                <div className={`flex items-center space-x-3 ${isExpired ? 'opacity-60' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${isExpired ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fim das Propostas</p>
                    <p className="text-lg">{formatDateTime(procurement.proposalEndDate)}</p>
                    {isExpired && <p className="text-sm text-red-600">Prazo expirado</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status da Licitação */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Status Atual</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Estado da Licitação:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  procurement.isOpen && !isExpired
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {procurement.isOpen && !isExpired ? 'Ativa' : 'Inativa'}
                </span>
              </div>

              {procurement.proposalEndDate && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Prazo para Propostas:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    isExpired ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isExpired ? 'Expirado' : 'Em andamento'}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Data de Cadastro:</span>
                <span className="text-sm text-gray-600">
                  {formatDate(procurement.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos */}
      {procurement.documents && procurement.documents.length > 0 && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📄 Documentos ({procurement.documents.length})</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {procurement.documents.map((doc: any) => (
              <div key={doc.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <span className="text-2xl">📄</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{doc.title || 'Documento sem título'}</p>
                  <p className="text-sm text-gray-500">Tipo: {doc.documentTypeCode || 'Não informado'}</p>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      📎 Visualizar documento
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Informações Técnicas */}
      <div className="mt-6 rounded-lg bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 Informações Técnicas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-500">ID Interno</p>
            <p className="text-sm font-mono text-gray-700">{procurement.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Última Atualização</p>
            <p className="text-sm text-gray-700">{formatDateTime(procurement.updatedAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Fonte de Dados</p>
            <p className="text-sm text-gray-700">PNCP - Portal Nacional de Contratações Públicas</p>
          </div>
        </div>
      </div>
    </main>
  );
}
