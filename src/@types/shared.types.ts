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
