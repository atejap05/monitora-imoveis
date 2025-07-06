export type DadosUsuarioAutenticado = {
  cpf: string;
  email: string;
  nome: string;
  matricula: string;
  unidade_cod: string;
};

export type Municipio = {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
  "regiao-imediata": {
    id: number;
    nome: string;
    "regiao-intermediaria": {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
};

export type TFormData = {
  filtro: string;
  uf: string | null;
  municipio: string | null;
  regiao: string | null;
  anos: string[];
  contribuintes?: string[] | null;
  valorMin?: string | null;
  valorMax?: string | null;
};

export type TConsultaNFSeTotais = {
  [key: string]: {
    total: number;
    me_epp: number;
    mei: number;
    nao_optante: number;
  };
};

export type TConsultaNFSeTotaisMeiAmbiente = {
  year: string;
  app: number;
  web: number;
  webservice: number;
  proprio: number;
}[];

export type TFilter = {
  filtro: string;
  anos: number[];
  contribuintes: number[];
  valorMin: number | null;
  valorMax: number | null;
  uf: string | null;
  municipio: number | null;
  regiao: string | null;
};

export type TVisaoGeral = {
  nfseTotais: TConsultaNFSeTotais;
  distribuicaoFrequencia: any; // Defina um tipo mais específico se souber a estrutura
};

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
