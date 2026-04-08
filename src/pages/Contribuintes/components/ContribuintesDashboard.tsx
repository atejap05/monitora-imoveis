// Removido: useSyncContribuintesData duplicado
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { ContribuintesKpiCards } from "./ContribuintesKpiCards";
import { ContribuintesTipoTable } from "./ContribuintesTipoTable";
import { MapSkeleton } from "./MapSkeleton";
import { Suspense, lazy } from "react";
import ContribuintesSkeletons from "./ContribuintesSkeletons";
import {
  CONTAINER_MAX_WIDTH,
  RESPONSIVE_PADDING,
  RESPONSIVE_GAP,
  KPI_GRID_CLASSES,
} from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BasicTooltip from "@/components/BasicTooltip";
import { generateAndDownloadPdf, buildReportFilename, captureAllCharts } from "@/lib/pdf";
import { ContribuintesReport } from "../report/ContribuintesReport";

// Lazy loading do componente de mapa
const ContribuintesMapChart = lazy(() =>
  import("./ContribuintesMapChart").then(module => ({
    default: module.ContribuintesMapChart,
  }))
);

const ContribuintesDashboard = () => {
  const { submittedFilters, error, isLoading, data } = useContribuintesFiltersState();

  // Extract years from filters for FiltroHeader
  const returnedYears = submittedFilters?.anos?.map(String) || [];

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGenerateReport = async () => {
    if (!data) return;
    setIsGeneratingPdf(true);
    try {
      const charts = await captureAllCharts({
        mapa: "[data-chart-id='contribuintes-mapa']",
      });
      const filename = buildReportFilename("contribuintes", {
        filtro: submittedFilters?.filtro,
        uf: submittedFilters?.uf,
      });
      await generateAndDownloadPdf(
        <ContribuintesReport
          kpis={data.kpis || null}
          tipoContribuinte={data.tipo_contribuinte_responsavel || []}
          mapaMunicipios={data.mapa_municipios}
          filters={{
            filtro: submittedFilters?.filtro || "todos",
            uf: submittedFilters?.uf,
            municipio: submittedFilters?.municipio ? String(submittedFilters.municipio) : null,
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

  if (isLoading) {
    return <ContribuintesSkeletons />;
  }

  if (error) {
    return (
      <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
        <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
          Dashboard de Contribuintes
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
          <p className="text-red-600 mt-1">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard de Contribuintes
        </h1>
        {data && !isLoading && (
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
      {/* Mostra FiltroHeader apenas se não estiver carregando */}
      {submittedFilters && (
        <FiltroHeader
          submittedFilters={submittedFilters}
          returnedYears={returnedYears}
        />
      )}

      {/* Área principal do dashboard */}
      <div className={`flex flex-col ${RESPONSIVE_GAP}`}>
        {/* KPI Cards */}
        <div className={KPI_GRID_CLASSES}>
          <ContribuintesKpiCards />
        </div>

        {/* Tabela detalhada */}
        <div className="w-full">
          <ContribuintesTipoTable />
        </div>

        {/* Mapa de Distribuição */}
        <div className="w-full">
          <Suspense fallback={<MapSkeleton />}>
            <ContribuintesMapChart />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ContribuintesDashboard;
