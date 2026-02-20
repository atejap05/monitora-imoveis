import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  BarChart2,
  TrendingUp,
  Sigma,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  calcularKpisVolumDiario,
  formatarDataProcessamento,
} from "./utils";
import {
  formatarDataEtl,
  verificarDadosDesatualizados,
} from "@/lib/utils";
import { VolumetriaKpiDiarioCard } from "./VolumetriaKpiDiarioCard";
import { VolumetriaDiarioLineChart } from "./VolumetriaDiarioLineChart";
import { VolumetriaItem } from "@/@types";

type Period = "7d" | "30d" | "90d" | "all";

const mapToSparkData = (data: VolumetriaItem[]) =>
  data.map(d => ({
    data_etl: formatarDataProcessamento(d.data_processamento),
    qtd_nfse: d.total_nfse_processadas,
  }));

type Props = {
  data: VolumetriaItem[];
};

export const VolumetriaDiarioSection = ({ data }: Props) => {
  const [period, setPeriod] = useState<Period>("30d");

  if (!data || data.length === 0) {
    return (
      <div className="w-full mt-6 text-gray-500">
        Nenhum dado disponível para o monitoramento diário.
      </div>
    );
  }

  const kpis = calcularKpisVolumDiario(data, period);
  const dadosDesatualizados = verificarDadosDesatualizados(kpis.ultimaData);
  const sparkData = mapToSparkData(kpis.filteredData);
  const sparkDataLast7 = mapToSparkData(kpis.filteredData.slice(-7));

  const periodLabel =
    period === "all"
      ? kpis.filteredData.length
      : period.replace("d", "");

  return (
    <div className="w-full mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Monitoramento Diário</h2>

        <div className="flex flex-wrap gap-2 items-center">
          {dadosDesatualizados && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle size={14} />
              Dados desatualizados
            </Badge>
          )}

          <Badge variant="outline" className="flex items-center gap-1">
            <Info size={14} />
            Última atualização:{" "}
            {kpis.ultimaData ? formatarDataEtl(kpis.ultimaData) : "N/A"}
          </Badge>

          {kpis.diasSemDados > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {kpis.diasSemDados} dia(s) sem dados no período
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <Button
          variant={period === "7d" ? "default" : "outline"}
          className={
            period === "7d"
              ? "bg-green text-white border-green hover:bg-green hover:text-white"
              : "bg-white text-green border-green hover:bg-green-50 hover:text-green-800"
          }
          onClick={() => setPeriod("7d")}
        >
          7 dias
        </Button>
        <Button
          variant={period === "30d" ? "default" : "outline"}
          className={
            period === "30d"
              ? "bg-green text-white border-green hover:bg-green hover:text-white"
              : "bg-white text-green border-green hover:bg-green-50 hover:text-green-800"
          }
          onClick={() => setPeriod("30d")}
        >
          30 dias
        </Button>
        <Button
          variant={period === "90d" ? "default" : "outline"}
          className={
            period === "90d"
              ? "bg-green text-white border-green hover:bg-green hover:text-white"
              : "bg-white text-green border-green hover:bg-green-50 hover:text-green-800"
          }
          onClick={() => setPeriod("90d")}
        >
          90 dias
        </Button>
        <Button
          variant={period === "all" ? "default" : "outline"}
          className={
            period === "all"
              ? "bg-green text-white border-green hover:bg-green hover:text-white"
              : "bg-white text-green border-green hover:bg-green-50 hover:text-green-800"
          }
          onClick={() => setPeriod("all")}
        >
          Tudo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VolumetriaKpiDiarioCard
          title="Volume Último Dia"
          value={kpis.ultimoDia?.total_nfse_processadas ?? 0}
          sparkData={sparkDataLast7}
          description={
            kpis.ultimoDia
              ? formatarDataEtl(
                  formatarDataProcessamento(kpis.ultimoDia.data_processamento)
                )
              : "N/A"
          }
          icon={<CalendarCheck size={18} />}
        />
        <VolumetriaKpiDiarioCard
          title={`Média Diária (${periodLabel}d)`}
          value={Math.round(kpis.media)}
          sparkData={sparkData}
          icon={<BarChart2 size={18} />}
        />
        <VolumetriaKpiDiarioCard
          title={`Pico de Processamento (${periodLabel}d)`}
          value={kpis.pico}
          sparkData={sparkData}
          description={kpis.picoData ? formatarDataEtl(kpis.picoData) : undefined}
          icon={<TrendingUp size={18} />}
        />
        <VolumetriaKpiDiarioCard
          title="Total no Período"
          value={kpis.totalPeriodo}
          sparkData={sparkData}
          icon={<Sigma size={18} />}
        />
      </div>

      <VolumetriaDiarioLineChart data={kpis.filteredData} />

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">
          Informações do Período
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Período solicitado:</span>
            <p className="font-medium">
              {period === "all"
                ? "Todos os dados"
                : `${period.replace("d", "")} dias`}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Dados disponíveis:</span>
            <p className="font-medium">{kpis.diasComDados} dia(s)</p>
          </div>
          <div>
            <span className="text-gray-600">Dias sem dados:</span>
            <p className="font-medium">{kpis.diasSemDados} dia(s)</p>
          </div>
          <div>
            <span className="text-gray-600">Período real:</span>
            <p className="font-medium">
              {kpis.periodoReal.inicio && kpis.periodoReal.fim
                ? `${formatarDataEtl(kpis.periodoReal.inicio)} - ${formatarDataEtl(kpis.periodoReal.fim)}`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Período completo:</span>
              <p className="font-medium">
                {kpis.periodoCompleto.inicio && kpis.periodoCompleto.fim
                  ? `${formatarDataEtl(kpis.periodoCompleto.inicio)} - ${formatarDataEtl(kpis.periodoCompleto.fim)}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Total de dias:</span>
              <p className="font-medium">
                {kpis.diasComDados + kpis.diasSemDados} dia(s)
              </p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium">
                {kpis.diasSemDados > 0 ? (
                  <span className="text-orange-600 font-medium">Incompleto</span>
                ) : (
                  <span className="text-green-600 font-medium">Completo</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Última atualização:</span>
              <p className="font-medium">
                {kpis.ultimaData ? formatarDataEtl(kpis.ultimaData) : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
