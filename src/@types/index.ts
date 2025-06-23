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
