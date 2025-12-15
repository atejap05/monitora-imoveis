import React from "react";
import { useVolumetriaFiltersState } from "@/state/volumetriaFiltersState";
import { useSyncVolumetriaData } from "./hooks/useSyncVolumetriaData";
import { VolumetriaWelcome } from "./components/VolumetriaWelcome";
import { VolumetriaKpiCards } from "./components/VolumetriaKpiCards";
import { VolumetriaEvolucaoMensal } from "./components/VolumetriaEvolucaoMensal";
import { VolumetriaSazonalidade } from "./components/VolumetriaSazonalidade";
import { VolumetriaPadroesSemanais } from "./components/VolumetriaPadroesSemanais";
import { VolumetriaPadroesHorarios } from "./components/VolumetriaPadroesHorarios";
import {
  VolumetriaKpiSkeleton,
  VolumetriaChartSingleSkeleton,
  VolumetriaChartSkeleton,
} from "./components/VolumetriaSkeletons";
import {
  calcularKpis,
  processarEvolucaoMensal,
  calcularSazonalidade,
  processarPadroesSemanais,
  processarPadroesHorarios,
} from "./components/utils";
import {
  CONTAINER_MAX_WIDTH,
  RESPONSIVE_PADDING,
  FLEX_COL_GAP_CLASSES,
} from "@/lib/constants";

const Volumetria: React.FC = () => {
  const { submittedFilters, data, isLoading } = useVolumetriaFiltersState();

  // Hook para sincronizar dados com backend
  useSyncVolumetriaData();

  // Verifica se consulta foi iniciada (filtros submetidos ou dados em cache)
  const consultaIniciada = !!(submittedFilters || data);

  // Processar dados quando disponíveis
  const kpis = data ? calcularKpis(data) : null;
  const evolucaoMensal = data ? processarEvolucaoMensal(data) : [];
  const sazonalidade = data ? calcularSazonalidade(data) : [];
  const padroesSemanais = data ? processarPadroesSemanais(data) : [];
  const padroesHorarios = data ? processarPadroesHorarios(data) : [];

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Análise de Volumetria NFSe
      </h1>

      {/* Tela de Boas-vindas (quando não há filtros) */}
      {!consultaIniciada && <VolumetriaWelcome />}

      {/* Conteúdo Principal */}
      {consultaIniciada && (
        <div className={FLEX_COL_GAP_CLASSES}>
          {/* KPIs */}
          {isLoading ? (
            <VolumetriaKpiSkeleton />
          ) : kpis ? (
            <VolumetriaKpiCards kpis={kpis} />
          ) : null}

          {/* Evolução Temporal (Coluna Única) */}
          {isLoading ? (
            <VolumetriaChartSingleSkeleton />
          ) : (
            <VolumetriaEvolucaoMensal evolucaoMensal={evolucaoMensal} />
          )}

          {/* Sazonalidade Mensal (Coluna Única) */}
          {isLoading ? (
            <VolumetriaChartSingleSkeleton />
          ) : (
            <VolumetriaSazonalidade sazonalidade={sazonalidade} />
          )}

          {/* Padrões Semanais */}
          {isLoading ? (
            <VolumetriaChartSkeleton />
          ) : (
            <VolumetriaPadroesSemanais padroesSemanais={padroesSemanais} />
          )}

          {/* Padrões Horários */}
          {isLoading ? (
            <VolumetriaChartSkeleton />
          ) : (
            <VolumetriaPadroesHorarios padroesHorarios={padroesHorarios} />
          )}
        </div>
      )}
    </div>
  );
};

export default Volumetria;
