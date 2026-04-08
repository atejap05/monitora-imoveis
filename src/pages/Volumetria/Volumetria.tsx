import React from "react";
import { useVolumetriaFiltersState } from "@/state/volumetriaFiltersState";
import { useSyncVolumetriaData } from "./hooks/useSyncVolumetriaData";
import { VolumetriaWelcome } from "./components/VolumetriaWelcome";
import { VolumetriaKpiCards } from "./components/VolumetriaKpiCards";
import { VolumetriaDiarioSection } from "./components/VolumetriaDiarioSection";
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
import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BasicTooltip from "@/components/BasicTooltip";
import { generateAndDownloadPdf, buildReportFilename, captureAllCharts } from "@/lib/pdf";
import { VolumetriaReport } from "./report/VolumetriaReport";

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

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGenerateReport = async () => {
    if (!kpis) return;
    setIsGeneratingPdf(true);
    try {
      const charts = await captureAllCharts({
        diario: "[data-chart-id='volumetria-diario']",
        evolucaoMensal: "[data-chart-id='volumetria-evolucao']",
        sazonalidade: "[data-chart-id='volumetria-sazonalidade']",
        padroesSemanais: "[data-chart-id='volumetria-semanal']",
        padroesHorarios: "[data-chart-id='volumetria-horario']",
      });
      const filename = buildReportFilename("volumetria", {
        filtro: submittedFilters?.filtro,
        uf: submittedFilters?.uf,
      });
      await generateAndDownloadPdf(
        <VolumetriaReport
          kpis={kpis}
          data={data ?? undefined}
          filters={{
            filtro: submittedFilters?.filtro,
            uf: submittedFilters?.uf,
            municipio: submittedFilters?.municipio,
            regiao: submittedFilters?.regiao,
            anos: submittedFilters?.anos,
          }}
          charts={charts}
        />,
        filename,
      );
      toast.success("Relatório PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar relatório PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Análise de Volumetria NFSe
        </h1>
        {kpis && !isLoading && (
          <BasicTooltip asChild content="Gerar Relatório PDF">
            <Button
              variant="outline"
              size="icon"
              onClick={handleGenerateReport}
              disabled={isGeneratingPdf}
              className="shadow-sm"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FileDown className="w-5 h-5 text-red-600" />
              )}
            </Button>
          </BasicTooltip>
        )}
      </div>

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

          {/* Monitoramento Diário (estilo ETL) */}
          {!isLoading && data && <VolumetriaDiarioSection data={data} />}

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
