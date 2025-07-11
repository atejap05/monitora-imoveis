/**
 * Define a estrutura de dados para o relatório consolidado de um município,
 * combinando informações da API da SEFIN e da base de dados local.
 */
export interface MunicipioStatus {
  /**
   * A região geográfica do Brasil (Norte, Nordeste, etc.).
   * Pode ser nulo se o município não estiver na base de dados local.
   */
  Regiao: string | null;

  /**
   * A Região Fiscal (RF01, RF02, etc.).
   * Pode ser nulo se o município não estiver na base de dados local.
   */
  RegiaoFiscal: string | null;

  /**
   * A sigla da Unidade Federativa (ex: 'SP', 'RO').
   */
  UF: string;

  /**
   * O código completo do IBGE para o município (7 dígitos).
   */
  CodigoMunicipio: string;

  /**
   * O nome oficial do município.
   */
  NomeMunicipio: string;

  /**
   * O status de convênio atualizado, consultado na API da SEFIN.
   * O uso de tipos literais garante que apenas esses valores sejam aceitos.
   */
  StatusConvenioSEFIN:
    | "Conveniado Ativo"
    | "Conveniado - Nao Ativo"
    | "Nao Conveniado"
    | "Erro na Consulta";

  /**
   * Indica se o município já enviou alguma NFS-e para a base de dados local.
   */
  AtivoNaBase: "Sim" | "Não";

  /**
   * Indica se a última atividade do município (se houver) ocorreu no período de análise definido na query.
   */
  AtivoUltimoPeriodo: "Sim" | "Não";

  /**
   * O timestamp (em formato de string, provavelmente ISO 8601) da última NFS-e registrada na base local.
   * É nulo se o município nunca enviou dados.
   */
  UltimaAtividade: string | null;

  /**
   * A chave única da última NFS-e registrada na base local.
   * É nulo se o município nunca enviou dados.
   */
  ChaveUltimaAtividade: string | null;
}

export type RelatorioStatus = {
  progresso: number;
  total: number;
  status:
    | "iniciando"
    | "coletando_dados"
    | "em_andamento"
    | "concluido"
    | "erro"
    | "nao_encontrado";
  resultado: MunicipioStatus[] | string | null;
  erro?: string;
};
