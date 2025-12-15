import React, { useEffect } from "react";
import { useAmbienteEmissao } from "./hooks/useAmbienteEmissao";
import { AmbienteWelcome } from "./components/AmbienteWelcome";

import { AmbienteKpiCards } from "./components/AmbienteKpiCards";
import { AmbientePieCharts } from "./components/AmbientePieCharts";
import { AmbienteBarChartBlock } from "./components/AmbienteBarChartBlock";
import { AmbienteLineChartBlock } from "./components/AmbienteLineChartBlock";
import { AmbienteDataTable } from "./components/AmbienteDataTable";
import {
  AmbienteKpiSkeleton,
  AmbienteChartSkeleton,
  AmbienteBarSkeleton,
  AmbienteLineSkeleton,
  AmbienteTableSkeleton,
} from "./components/AmbienteSkeletons";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { useAmbienteFiltersState } from "@/state/ambienteFiltersSate";
import { CONTAINER_MAX_WIDTH, RESPONSIVE_PADDING } from "@/lib/constants";

const Ambiente: React.FC = () => {
  // Reset do estado quando o componente for montado
  const reset = useAmbienteFiltersState(state => state.reset);

  useEffect(() => {
    reset();
  }, [reset]);

  // Se há filtros submetidos ou dados carregados, consultaIniciada deve ser true
  const { data, isLoading, error } = useAmbienteEmissao();

  // Recupera os filtros aplicados do Zustand (padrão submittedFilters)
  const submittedFilters = useAmbienteFiltersState(
    state => state.submittedFilters
  );

  const consultaIniciada = !!(
    submittedFilters || // Se há filtros submetidos, considera iniciada
    (data && data.length > 0)
  );

  // Debug para verificar o estado
  console.log("[Ambiente] consultaIniciada:", consultaIniciada, {
    submittedFilters,
    data: data?.length || 0,
    isLoading,
  });

  // Dados para gráfico de barras empilhadas (evolução anual por processo)
  const barChartData =
    data?.map((row: any) => ({
      year: row.ano.toString(),
      app: row.total_app,
      web: row.total_web,
      webservice: row.total_webservice,
      proprio: row.total_ambiente_municipio,
    })) || [];

  // Dados para gráfico de linhas (tendência nacional x município)
  const lineChartData =
    data?.map((row: any) => ({
      year: row.ano.toString(),
      nacional: row.total_ambiente_nacional,
      municipio: row.total_ambiente_municipio,
    })) || [];

  // Funções de agregação e KPIs
  const totalNacional =
    data?.reduce((acc, row) => acc + row.total_ambiente_nacional, 0) || 0;
  const totalMunicipio =
    data?.reduce((acc, row) => acc + row.total_ambiente_municipio, 0) || 0;
  const totalGeral =
    data?.reduce((acc, row) => acc + row.total_geral_ano, 0) || 0;
  const totalWeb = data?.reduce((acc, row) => acc + row.total_web, 0) || 0;
  const totalWebservice =
    data?.reduce((acc, row) => acc + row.total_webservice, 0) || 0;
  const totalApp = data?.reduce((acc, row) => acc + row.total_app, 0) || 0;
  const totalTranscrita =
    data?.reduce((acc, row) => acc + row.total_tipo_transcrita, 0) || 0;

  const adocaoNacional = totalGeral ? (totalNacional / totalGeral) * 100 : 0;
  const principalMeioValor = Math.max(totalWebservice, totalWeb, totalApp);
  const principalMeioNome =
    principalMeioValor === totalWebservice
      ? "Web Service"
      : principalMeioValor === totalWeb
      ? "Web"
      : principalMeioValor === totalApp
      ? "App"
      : "-";
  const pctTranscrita = totalGeral ? (totalTranscrita / totalGeral) * 100 : 0;

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Ambiente de Emissão
      </h1>

      {/* Só mostra a tela de boas-vindas se ainda não iniciou consulta e não há dados */}
      {!consultaIniciada && !(data && data.length > 0) && <AmbienteWelcome />}

      {(consultaIniciada || (data && data.length > 0)) && (
        <>
          {/* Header de Filtros Aplicados */}
          <FiltroHeader
            submittedFilters={submittedFilters}
            returnedYears={
              data ? data.map((row: any) => row.ano.toString()) : []
            }
          />

          {/* KPIs e Gráficos */}
          {isLoading ? (
            <>
              <AmbienteKpiSkeleton />
              <AmbienteChartSkeleton />
              <AmbienteBarSkeleton />
              <AmbienteLineSkeleton />
            </>
          ) : data && data.length > 0 ? (
            <>
              <AmbienteKpiCards
                adocaoNacional={adocaoNacional}
                principalMeioNome={principalMeioNome}
                pctTranscrita={pctTranscrita}
              />
              <AmbientePieCharts
                totalNacional={totalNacional}
                totalMunicipio={totalMunicipio}
                totalWebservice={totalWebservice}
                totalWeb={totalWeb}
                totalApp={totalApp}
              />
              <AmbienteBarChartBlock barChartData={barChartData} />
              <AmbienteLineChartBlock lineChartData={lineChartData} />
            </>
          ) : null}

          {/* Tabela de Dados */}
          {isLoading ? (
            <AmbienteTableSkeleton />
          ) : error ? (
            <div className="bg-white rounded shadow p-6 text-center text-red-500">
              Erro ao carregar dados do ambiente.
            </div>
          ) : data && data.length > 0 ? (
            <AmbienteDataTable data={data} />
          ) : (
            <div className="bg-white rounded shadow p-6 text-center text-gray-500">
              Nenhum dado encontrado para os filtros selecionados.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Ambiente;
