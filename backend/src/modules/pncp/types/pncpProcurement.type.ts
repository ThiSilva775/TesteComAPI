export interface PncpProcurement {
  numeroControlePNCP: string;
  numeroCompra?: string;
  anoCompra?: number;
  objetoCompra?: string;
  modalidadeId?: string | number;
  modalidadeNome?: string;
  situacaoCompraId?: string | number;
  situacaoCompraNome?: string;
  dataPublicacaoPncp?: string;
  dataInicioRecebimentoProposta?: string;
  dataFimRecebimentoProposta?: string;
  orgaoEntidade?: {
    cnpj: string;
    razaoSocial?: string;
  };
}
