export interface NfseData {
  nro_nfse: number;
  valor_liq: number;
  ano: number;
  ni_raiz_tomador: string;
  municipio: string;
  chave_acesso: string;
  loc_prestacao: string;
  ni_tomador: string;
  local_emissao: string;
  valor_servico: number;
  tomador: string;
  servico_nacional: string;
  ni_prestador: string;
  ni_raiz_pretador: string;
  mes: number;
  nbs: string;
  descricao_servico: string;
  municipio_tomador: string;
}

export type Consulta = {
  consulta: NfseData[];
};
