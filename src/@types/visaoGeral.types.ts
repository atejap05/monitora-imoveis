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
};
