export type TConsultaNFSeTotaisMeiAmbiente = {
  year: string;
  app: number;
  web: number;
  webservice: number;
  proprio: number;
}[];

export type TAmbienteEmissao = {
  ano: number;
  total_ambiente_nacional: number;
  total_web: number;
  total_geral_ano: number;
  total_tipo_transcrita: number;
  total_ambiente_municipio: number;
  total_tipo_nacional: number;
  total_webservice: number;
  total_app: number;
};
