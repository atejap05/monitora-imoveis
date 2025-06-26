import { useEtlData } from "../hooks/useEtlData";
import { EtlKpiCard } from "./EtlKpiCard";
import { EtlKpiCardSkeleton } from "./EtlKpiCard";
import { EtlLineChart } from "./EtlLineChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarCheck, BarChart2, TrendingUp, Sigma } from "lucide-react";
import { BarLoader } from "react-spinners";

const LocalEtlSection = () => {
  const { data: etlData, loading: loadingEtl } = useEtlData();
  const [period, setPeriod] = useState<"7d" | "30d" | "all">("30d");

  if (loadingEtl) {
    return (
      <div className="w-full mt-6 flex flex-col gap-6">
        <h1>
          <span className="text-2xl font-bold">Volumetria</span>
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

  // Ordenar do mais antigo para o mais recente
  const sortedData = [...etlData].sort((a, b) =>
    a.data_etl.localeCompare(b.data_etl)
  );

  let filteredData = sortedData;
  if (period === "7d") filteredData = sortedData.slice(-7);
  else if (period === "30d") filteredData = sortedData.slice(-30);

  // KPIs
  const ultimoDia = filteredData[filteredData.length - 1];
  const media = Math.round(
    filteredData.reduce((acc, d) => acc + d.qtd_nfse, 0) /
      (filteredData.length || 1)
  );
  const pico = Math.max(...filteredData.map(d => d.qtd_nfse));
  const totalPeriodo = filteredData.reduce((acc, d) => acc + d.qtd_nfse, 0);

  return (
    <div className="w-full mt-6 flex flex-col gap-6">
      <h1>
        <span className="text-2xl font-bold">Volumetria</span>
      </h1>
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
          value={ultimoDia?.qtd_nfse || 0}
          sparkData={filteredData.slice(-7)}
          description={ultimoDia?.data_etl}
          icon={<CalendarCheck size={18} />}
        />
        <EtlKpiCard
          title={`Média Diária (${
            period === "all" ? filteredData.length : period.replace("d", "")
          }d)`}
          value={media}
          sparkData={filteredData}
          icon={<BarChart2 size={18} />}
        />
        <EtlKpiCard
          title={`Pico de Processamento (${
            period === "all" ? filteredData.length : period.replace("d", "")
          }d)`}
          value={pico}
          sparkData={filteredData}
          icon={<TrendingUp size={18} />}
        />
        <EtlKpiCard
          title={`Total no Período`}
          value={totalPeriodo}
          sparkData={filteredData}
          icon={<Sigma size={18} />}
        />
      </div>
      <EtlLineChart data={filteredData} />
    </div>
  );
};

export default LocalEtlSection;
