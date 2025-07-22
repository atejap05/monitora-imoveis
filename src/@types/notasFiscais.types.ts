export type TNotasFiscaisCanceladas = {
  cod_evento: string;
  descr_evento: string;
  total_notas: number;
}[];

export type TTop100NFSe = {
  valordoservico: number;
  chaveacesso: string;
  nome_tomador: string;
  cnpjcpf_prestador: string;
  nome_prestador: string;
  statusnota: string;
  dataemissao: string; // Consider using Date if you parse it
  cnpjcpf_tomador: string;
  municipio_prestador: string;
  uf_prestador: string;
  descricao_servico: string;
}[];
