export type TConsultaNFSeTotais = {
  [key: string]: {
    total: number;
    me_epp: number;
    mei: number;
    nao_optante: number;
  };
};

export type TVisaoGeral = {
  nfseTotais: TConsultaNFSeTotais;
  distribuicaoFrequencia: any; // Defina um tipo mais específico se souber a estrutura
  adesaoMunicipios: TAdesaoMunicipios;
};

export type TAdesaoMunicipioItem = {
  mes_referencia: string;
  total_acumulado_municipios: number;
};

export type TAdesaoMunicipios = TAdesaoMunicipioItem[];
