import type { TMunicipioMapa, TUfMapa } from "@/@types/contribuintes.types";

/**
 * Função utilitária para processar dados do mapa
 * Agrega dados de municípios por UF para visualização no mapa
 */
export const processMapData = (municipiosData: TMunicipioMapa[] = []) => {
  if (!municipiosData.length) {
    return {
      ufData: [],
      municipiosData,
      isLoading: false,
      error: null,
    };
  }

  // Agrupa municípios por UF
  const ufGroups = municipiosData.reduce((acc, municipio) => {
    const { uf } = municipio;

    if (!acc[uf]) {
      acc[uf] = {
        uf,
        total_contribuintes: 0,
        total_nfse: 0,
        valor_total: 0,
        valor_medio: 0,
        nao_optante: 0,
        mei: 0,
        me_epp: 0,
        municipios_count: 0,
      };
    }

    // Soma os valores - CORRIGINDO O MAPEAMENTO DOS CAMPOS
    acc[uf].total_nfse += municipio.total_nfse;
    acc[uf].valor_total += municipio.valor_total;
    acc[uf].nao_optante += municipio.total_nao_optante ?? 0; // Corrigido para tratar null
    acc[uf].mei += municipio.total_mei ?? 0; // Corrigido para tratar null
    acc[uf].me_epp += municipio.total_me_epp ?? 0; // Corrigido para tratar null
    acc[uf].municipios_count += 1;

    return acc;
  }, {} as Record<string, TUfMapa & { municipios_count: number }>);

  // Calcula valores médios e total de contribuintes
  const ufData = Object.values(ufGroups)
    .map(uf => {
      const valor_medio =
        uf.municipios_count > 0 ? uf.valor_total / uf.municipios_count : 0;
      const total_contribuintes =
        (uf.nao_optante ?? 0) + (uf.mei ?? 0) + (uf.me_epp ?? 0); // Corrigido para tratar null

      return {
        uf: uf.uf,
        total_contribuintes,
        total_nfse: uf.total_nfse,
        valor_total: uf.valor_total,
        valor_medio,
        nao_optante: uf.nao_optante,
        mei: uf.mei,
        me_epp: uf.me_epp,
      };
    })
    .sort((a, b) => b.total_contribuintes - a.total_contribuintes);

  return {
    ufData,
    municipiosData,
    isLoading: false,
    error: null,
  };
};
