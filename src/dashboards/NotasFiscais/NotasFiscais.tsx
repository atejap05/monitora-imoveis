import { TabsContent } from "@/components/ui/tabs";
// import DashCard from "@/components/DashCard";
// import DashBarChart from "@/components/DashBarChart";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
type ChartData = Array<{
  emitente: string;
  total: number;
  fill: string;
}>;
const NotasFiscais = () => {
  const { consultaNFSeTotais, isPending } = useNotasFiscaisState();

  // Preparar os dados para o PieChart. Sera um chart por ano com os totais de NFSe
  const chartData = Object.entries(consultaNFSeTotais).map(([year, data]) => {
    const chartData: ChartData = Object.entries(data)
      .filter(([emitente]) => emitente !== "total")
      .map(([emitente, total]) => {
        let fill = "";
        switch (emitente) {
          case "mei":
            fill = "hsl(var(--chart-2))";
            break;
          case "me_epp":
            fill = "hsl(var(--chart-3))";
            break;
          case "nao_optante":
            fill = "hsl(var(--chart-1))";
            break;
        }
        return {
          emitente,
          total,
          fill,
        };
      });
    return {
      year,
      data: chartData,
    };
  });

  return (
    <TabsContent value="nfse" className=" pl-4 py-6">
      <div>nfse</div>

      {isPending ? (
        <div className="flex flex-col justify-center items-center gap-3 h-96">
          <HashLoader
            loading={isPending}
            color="#709f77"
            aria-label="Loading ..."
          />

          <span className="text-green animate-pulse">
            Consultado o Receita Data ...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
          {chartData.map((chart, index) => (
            <PieChartNFSe key={index} chartData={chart.data} ano={chart.year} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default NotasFiscais;
