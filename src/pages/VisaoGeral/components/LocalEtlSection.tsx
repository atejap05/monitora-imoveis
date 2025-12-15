import { useEtlData } from "../hooks/useEtlData";
import { EtlKpiCard } from "./EtlKpiCard";
import { EtlKpiCardSkeleton } from "./EtlKpiCard";
import { EtlLineChart } from "./EtlLineChart";
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
import { BarLoader } from "react-spinners";
import {
  calcularKpisEtl,
  formatarDataEtl,
  verificarDadosDesatualizados,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const LocalEtlSection = () => {
  const { data: etlData, loading: loadingEtl } = useEtlData();
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  if (loadingEtl) {
    return (
      <div className="w-full mt-6 flex flex-col gap-6">
        <h1>
          <span className="text-2xl font-bold">Volumetria - ETL</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EtlKpiCardSkeleton />
          <EtlKpiCardSkeleton />
          <EtlKpiCardSkeleton />
          <EtlKpiCardSkeleton />
        </div>
        <div className="flex flex-col justify-center items-center h-80 gap-3">
          <BarLoader color="#709f77" />
          <span className="text-green text-lg font-semibold ml-4 animate-pulse">
            Carregando dados do ETL...
          </span>
        </div>
      </div>
    );
  }

  if (!etlData || etlData.length === 0) {
    return <div>Nenhum dado disponível para o gráfico ETL.</div>;
  }

  // Usar as novas funções de cálculo do utils
  const kpis = calcularKpisEtl(etlData, period);
  const dadosDesatualizados = verificarDadosDesatualizados(
    kpis.ultimaAtualizacao
  );

  // Usar os dados completos (incluindo dias sem dados) para o gráfico
  let filteredData = kpis.dadosCompletos;

  if (period === "7d") {
    // Para 7 dias: usar os últimos 7 dias dos dados reais
    const dadosReais = etlData.sort((a, b) =>
      a.data_etl.localeCompare(b.data_etl)
    );
    filteredData = dadosReais.slice(-7);
  } else if (period === "30d") {
    // Para 30 dias: usar os últimos 30 dias dos dados reais
    const dadosReais = etlData.sort((a, b) =>
      a.data_etl.localeCompare(b.data_etl)
    );
    filteredData = dadosReais.slice(-30);
  }
  // Para período "all", usar todos os dados completos (já configurado em kpis.dadosCompletos)

  return (
    <div className="w-full mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1>
          <span className="text-2xl font-bold">Volumetria</span>
        </h1>

        {/* Indicadores de Status dos Dados */}
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
            {kpis.ultimaAtualizacao
              ? formatarDataEtl(kpis.ultimaAtualizacao)
              : "N/A"}
          </Badge>

          {kpis.diasSemDados > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {kpis.diasSemDados} dia(s) sem dados no período
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-2">
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
        <EtlKpiCard
          title="Volume Último Dia"
          value={kpis.ultimoDia?.qtd_nfse || 0}
          sparkData={filteredData.slice(-7)}
          description={
            kpis.ultimoDia?.data_etl
              ? formatarDataEtl(kpis.ultimoDia.data_etl)
              : "N/A"
          }
          icon={<CalendarCheck size={18} />}
        />
        <EtlKpiCard
          title={`Média Diária (${
            period === "all"
              ? kpis.dadosCompletos.length
              : period.replace("d", "")
          }d)`}
          value={kpis.media}
          sparkData={filteredData}
          icon={<BarChart2 size={18} />}
        />
        <EtlKpiCard
          title={`Pico de Processamento (${
            period === "all"
              ? kpis.dadosCompletos.length
              : period.replace("d", "")
          }d)`}
          value={kpis.pico}
          sparkData={filteredData}
          icon={<TrendingUp size={18} />}
        />
        <EtlKpiCard
          title={`Total no Período`}
          value={kpis.totalPeriodo}
          sparkData={filteredData}
          icon={<Sigma size={18} />}
        />
      </div>

      {/* Informações Adicionais */}
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
                ? `${formatarDataEtl(
                    kpis.periodoReal.inicio
                  )} - ${formatarDataEtl(kpis.periodoReal.fim)}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Informações do Período Completo */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Período completo:</span>
              <p className="font-medium">
                {kpis.periodoCompleto.inicio && kpis.periodoCompleto.fim
                  ? `${formatarDataEtl(
                      kpis.periodoCompleto.inicio
                    )} - ${formatarDataEtl(kpis.periodoCompleto.fim)}`
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
                  <span className="text-orange-600 font-medium">
                    Incompleto
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">Completo</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Última ETL:</span>
              <p className="font-medium">
                {kpis.ultimaAtualizacao
                  ? formatarDataEtl(kpis.ultimaAtualizacao)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EtlLineChart data={filteredData} />
    </div>
  );
};

export default LocalEtlSection;
