import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { fetchMapData, fetchTipoContribuinteResponsavel } from "@/service/contribuintes";
import { processMapData } from "./processMapData";
import type { TContribuintesData } from "@/@types";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useSyncContribuintesData = () => {
    const { submittedFilters, setData, setLoading, setError } = useContribuintesFiltersState();

    const { isLoading, error, data, isSuccess, isError } = useQuery({
        queryKey: QUERY_KEYS.contribuintesData(submittedFilters!),
        queryFn: async () => {
            if (!submittedFilters) {
                throw new Error("Filtros não submetidos para a busca.");
            }

            // Busca dados sequencialmente para não sobrecarregar backend
            const mapResponse = await queuedBackendCall(() => fetchMapData(submittedFilters), 'normal');
            const tipoContribuinteResponse = await queuedBackendCall(() => fetchTipoContribuinteResponsavel(submittedFilters), 'normal');

            // Processa dados do mapa
            const { ufData } = processMapData(mapResponse || []);

            // Cria estrutura de dados com os dados do mapa e tipo de contribuinte responsável
            const mapOnlyData: TContribuintesData = {
                kpis: {
                    total_contribuintes: 0,
                    faturamento_total: 0,
                    perfil_dominante: "MEI",
                    faturamento_medio_por_contribuinte: 0
                },
                charts: {
                    mapa_uf: ufData, // Dados processados para o mapa
                    top_municipios: [],
                    composicao_por_tipo: [],
                    faturamento_por_tipo: [],
                    crescimento_anual: []
                },
                contribuintes: [],
                total_pages: 0,
                current_page: 1,
                mapa_municipios: mapResponse, // Dados brutos dos municípios
                tipo_contribuinte_responsavel: tipoContribuinteResponse || [] // Dados para a tabela
            };

            return mapOnlyData;
        },
        enabled: !!submittedFilters,
        // staleTime configurado globalmente para 1 hora
    });

    useEffect(() => {
        setLoading(isLoading);
        if (isError && error) {
            console.error("Erro ao buscar dados:", error);
            setError(error instanceof Error ? error : new Error("Erro desconhecido"));
            setData(null);
            return;
        }
        if (isSuccess && data) {
            setData(data);
            setError(null);
        }
    }, [isLoading, isSuccess, isError, error, data, setLoading, setData, setError]);
}; 