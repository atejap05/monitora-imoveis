import { useEffect } from "react";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { fetchMapData, fetchTipoContribuinteResponsavel } from "@/service/contribuintes";
import { processMapData } from "./processMapData";
import type { TContribuintesData } from "@/@types";

export const useSyncContribuintesData = () => {
    const { submittedFilters, setData, setLoading, setError } = useContribuintesFiltersState();

    useEffect(() => {
        if (!submittedFilters) return;

        const fetchData = async () => {
            try {
                setError(null);

                // Busca dados do mapa e dados de tipo de contribuinte responsável em paralelo
                const [mapResponse, tipoContribuinteResponse] = await Promise.all([
                    fetchMapData(submittedFilters),
                    fetchTipoContribuinteResponsavel(submittedFilters)
                ]);

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

                setData(mapOnlyData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setError(error instanceof Error ? error : new Error("Erro desconhecido"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [submittedFilters, setData, setLoading, setError]);
}; 