import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";
import type { TFilter, TContribuintesFilter } from "@/@types";
import {
  fetchNotasFiscais,
  fetchDistribuicaoFrequencia,
  fetchAdesaoMunicipios,
  fetchNotasFiscaisCanceladas,
  fetchTop100NotasFiscais,
  fetchAmbienteEmissao,
  fetchMapData,
  fetchTipoContribuinteResponsavel,
} from "@/service";

/**
 * Hook para prefetch inteligente de dados relacionados
 * Reduz revalidações na navegação entre páginas
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  /**
   * Prefetch dados da Visão Geral quando usuário aplica filtros
   */
  const prefetchVisaoGeral = (filters: TFilter) => {
    // Prefetch dados principais da visão geral
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.visaoGeralData(filters),
      queryFn: async () => {
        const nfseTotais = await queuedBackendCall(
          () => fetchNotasFiscais(filters),
          "low"
        );
        const distribuicaoFrequencia = await queuedBackendCall(
          () => fetchDistribuicaoFrequencia(filters),
          "low"
        );
        const adesaoMunicipios = await queuedBackendCall(
          () => fetchAdesaoMunicipios(filters),
          "low"
        );
        return { nfseTotais, distribuicaoFrequencia, adesaoMunicipios };
      },
    });
  };

  /**
   * Prefetch dados das Notas Fiscais quando aplicar filtros similares
   */
  const prefetchNotasFiscais = (filters: TFilter) => {
    // Prefetch dados canceladas
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.notasFiscaisCanceladas(filters),
      queryFn: () =>
        queuedBackendCall(() => fetchNotasFiscaisCanceladas(filters), "low"),
    });

    // Prefetch Top 100
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.notasFiscaisTop100(filters),
      queryFn: () =>
        queuedBackendCall(() => fetchTop100NotasFiscais(filters), "low"),
    });
  };

  /**
   * Prefetch dados de Ambiente quando aplicar filtros similares
   */
  const prefetchAmbiente = (filters: TFilter) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.ambienteEmissao(filters),
      queryFn: () =>
        queuedBackendCall(() => fetchAmbienteEmissao(filters), "low"),
    });
  };

  /**
   * Prefetch dados de Contribuintes quando aplicar filtros similares
   */
  const prefetchContribuintes = (filters: TContribuintesFilter) => {
    // Prefetch dados do mapa
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.contribuintesMap(filters),
      queryFn: () => queuedBackendCall(() => fetchMapData(filters), "low"),
    });

    // Prefetch tipos de contribuinte
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.contribuintesTipo(filters),
      queryFn: () =>
        queuedBackendCall(
          () => fetchTipoContribuinteResponsavel(filters),
          "low"
        ),
    });
  };

  /**
   * Prefetch automático baseado na página atual e filtros
   * Quando usuário aplica filtros em uma página, prefetch páginas relacionadas
   */
  const prefetchRelatedPages = (
    currentPage: string,
    filters: TFilter | TContribuintesFilter
  ) => {
    const isContribuintesFilter = (f: any): f is TContribuintesFilter =>
      typeof f === "object" && f !== null;

    switch (currentPage) {
      case "visaoGeral":
        // Quando estiver na visão geral, prefetch notas fiscais e ambiente
        if (!isContribuintesFilter(filters)) {
          prefetchNotasFiscais(filters);
          prefetchAmbiente(filters);
        }
        break;

      case "notasFiscais":
        // Quando estiver nas notas fiscais, prefetch visão geral e ambiente
        if (!isContribuintesFilter(filters)) {
          prefetchVisaoGeral(filters);
          prefetchAmbiente(filters);
        }
        break;

      case "ambiente":
        // Quando estiver no ambiente, prefetch visão geral e notas fiscais
        if (!isContribuintesFilter(filters)) {
          prefetchVisaoGeral(filters);
          prefetchNotasFiscais(filters);
        }
        break;

      case "contribuintes":
        // Contribuintes tem filtros diferentes, só prefetch internos
        if (isContribuintesFilter(filters)) {
          prefetchContribuintes(filters);
        }
        break;
    }
  };

  /**
   * Invalida cache de páginas relacionadas quando dados mudam
   */
  const invalidateRelatedQueries = (page: string) => {
    switch (page) {
      case "all":
        queryClient.invalidateQueries();
        break;
      case "visaoGeral":
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.visaoGeral });
        break;
      case "notasFiscais":
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notasFiscais });
        break;
      case "ambiente":
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ambiente });
        break;
      case "contribuintes":
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contribuintes });
        break;
    }
  };

  return {
    prefetchVisaoGeral,
    prefetchNotasFiscais,
    prefetchAmbiente,
    prefetchContribuintes,
    prefetchRelatedPages,
    invalidateRelatedQueries,
  };
};
