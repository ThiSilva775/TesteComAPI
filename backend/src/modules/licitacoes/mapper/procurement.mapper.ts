import { PncpProcurement } from '../../pncp/types/pncpProcurement.type';

export const procurementMapper = {
  fromPncp(item: PncpProcurement) {
    return {
      pncpControlNumber: item.numeroControlePNCP,
      procurementNumber: item.numeroCompra,
      year: item.anoCompra,
      title: item.objetoCompra,
      modalityCode: item.modalidadeId?.toString(),
      modalityDescription: item.modalidadeNome,
      situationCode: item.situacaoCompraId?.toString(),
      situationDescription: item.situacaoCompraNome,
      publicationDate: item.dataPublicacaoPncp ? new Date(item.dataPublicacaoPncp) : null,
      proposalStartDate: item.dataInicioRecebimentoProposta ? new Date(item.dataInicioRecebimentoProposta) : null,
      proposalEndDate: item.dataFimRecebimentoProposta ? new Date(item.dataFimRecebimentoProposta) : null,
      isOpen: Boolean(item.dataFimRecebimentoProposta && new Date(item.dataFimRecebimentoProposta) > new Date()),
      organization: item.orgaoEntidade?.cnpj
        ? {
            cnpj: item.orgaoEntidade.cnpj,
            name: item.orgaoEntidade.razaoSocial ?? 'Não informado'
          }
        : null,
      localRaw: item
    };
  }
};
