import { VisaoGeralTable } from "./VisaoGeralTable.tsx";
import { distFreqColumns } from "./VisaoGeralColumns.tsx";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState.ts";
import { formatNumber } from "@/lib/utils";
import { FiltroHeader } from "@/components/Layout/FiltroHeader";
import { VisaoGeralAdesaoChart } from "./VisaoGeralAdesaoChart.tsx";
import { VisaoGeralAdesaoChartSkeleton } from "./VisaoGeralAdesaoChartSkeleton.tsx";

import LocalEtlSection from "./LocalEtlSection";
import { FileText, User, Building2, Factory, FileDown, Loader2 } from "lucide-react";
import DashCard from "@/components/DashCard";
import BarLoader from "react-spinners/BarLoader";
import {
  CONTAINER_MAX_WIDTH,
  RESPONSIVE_PADDING,
  RESPONSIVE_GAP,
  KPI_GRID_CLASSES,
} from "@/lib/constants";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import BasicTooltip from "@/components/BasicTooltip";
import { generateAndDownloadPdf, buildReportFilename, captureAllCharts } from "@/lib/pdf";
import { VisaoGeralReport } from "../report/VisaoGeralReport";

const VisaoGeralDashboard = () => {
  const { data, isLoading, error, submittedFilters } =
    useVisaoGeralFiltersState();

  const nfseTotaisData = data?.nfseTotais;
  const distFreqData = data?.distribuicaoFrequencia;
  const adesaoData = data?.adesaoMunicipios;

  let aggregatedTotals = { total: 0, mei: 0, me_epp: 0, nao_optante: 0 };
  let returnedYears: string[] = [];
  if (nfseTotaisData) {
    returnedYears = Object.keys(nfseTotaisData);
    Object.values(nfseTotaisData).forEach(yearData => {
      aggregatedTotals.total += yearData.total || 0;
      aggregatedTotals.mei += yearData.mei || 0;
      aggregatedTotals.me_epp += yearData.me_epp || 0;
      aggregatedTotals.nao_optante += yearData.nao_optante || 0;
    });
  }

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGenerateReport = async () => {
    if (!nfseTotaisData) return;
    setIsGeneratingPdf(true);
    try {
      const charts = await captureAllCharts({
        adesao: "[data-chart-id='adesao-municipios']",
      });
      const filename = buildReportFilename("visao-geral", {
        filtro: submittedFilters?.filtro,
        uf: submittedFilters?.uf,
      });
      await generateAndDownloadPdf(
        <VisaoGeralReport
          nfseTotais={nfseTotaisData}
          distribuicaoFrequencia={distFreqData || null}
          adesaoMunicipios={adesaoData || null}
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

  if (error) {
    return (
      <div>
        Error loading data:
        <ul>
          <li>{error?.message}</li>
        </ul>
      </div>
    );
  }

  if (!submittedFilters) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-center text-gray-500">
          Selecione os filtros desejados e clique em "Aplicar Filtros" para
          visualizar os dados.
        </p>
      </div>
    );
  }

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Visão Geral da Base NFSe
        </h1>
        {nfseTotaisData && !isLoading && (
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
      <FiltroHeader
        submittedFilters={submittedFilters}
        returnedYears={returnedYears}
      />

      <div className={`flex flex-col ${RESPONSIVE_GAP}`}>
        <div className={KPI_GRID_CLASSES}>
          {isLoading ? (
            <>
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
              <DashCard isPending title="" value="" description="" />
            </>
          ) : (
            <>
              <DashCard
                title="Total de NFSe"
                description="Total de NFSe emitidas"
                value={formatNumber(aggregatedTotals.total)}
                icon={<FileText size={18} />}
              />
              <DashCard
                title="MEI"
                description="Total de NFSe MEI"
                value={formatNumber(aggregatedTotals.mei)}
                icon={<User size={18} />}
              />
              <DashCard
                title="ME/EPP"
                description="Total de NFSe ME/EPP"
                value={formatNumber(aggregatedTotals.me_epp)}
                icon={<Building2 size={18} />}
              />
              <DashCard
                title="Não Optantes"
                description="Total de NFSe de Não Optantes"
                value={formatNumber(aggregatedTotals.nao_optante)}
                icon={<Factory size={18} />}
              />
            </>
          )}
        </div>

        {isLoading ? (
          <VisaoGeralAdesaoChartSkeleton />
        ) : (
          <VisaoGeralAdesaoChart data={adesaoData} />
        )}

        {/* Tabela de distribuição de frequência abaixo do histograma */}
        <div className="w-full">
          <VisaoGeralTable
            title="Distribuição de Frequência"
            subtitle="Distribuição de frequência das notas fiscais por valor"
            data={distFreqData?.tabela_frequencias || []}
            columns={distFreqColumns}
            isLoading={isLoading}
            Loader={() => (
              <div className="flex flex-col justify-center items-center h-40 gap-3">
                <BarLoader color="#709f77" />
                <div className="text-green text-lg font-semibold ml-4 animate-pulse">
                  Carregando tabela...
                </div>
              </div>
            )}
            estatisticas={distFreqData?.estatisticas}
            metodoCalculo={distFreqData?.metodo_calculo}
          />
        </div>

        {/* Gráfico sobre as ETL no Banco de dados. */}
        <LocalEtlSection />
      </div>
    </div>
  );
};

export default VisaoGeralDashboard;
