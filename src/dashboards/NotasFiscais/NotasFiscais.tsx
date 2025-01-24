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
import { PieChartNFSe } from "./PieChartNFSe";
type ChartData = Array<{
  emitente: string;
  total: number;
  fill: string;
}>;
const NotasFiscais = () => {
  const { consultaNFSeTotais } = useNotasFiscaisState();

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

  console.log(chartData);
  return (
    <TabsContent value="nfse" className=" pl-4 py-6">
      <div>nfse</div>
      <div>{JSON.stringify(consultaNFSeTotais)}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
        {chartData.map((chart, index) => (
          <PieChartNFSe key={index} chartData={chart.data} ano={chart.year} />
        ))}
      </div>
    </TabsContent>

    // <TabsContent value="nfse" className=" pl-4 py-6">
    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
    //     <DashCard
    //       title="Notas Fiscais Emitidas"
    //       value={data ? String(data["2022"]) : "0"}
    //       description="Notas fiscais emitidas por MEI em 2022"
    //     />
    //     <DashCard
    //       title="Notas Fiscais Emitidas"
    //       value={data ? String(data["2022"]) : "0"}
    //       description="Notas fiscais emitidas por MEI em 2022"
    //     />
    //     <DashCard
    //       title="Notas Fiscais Emitidas"
    //       value={data ? String(data["2023"]) : "0"}
    //       description="Notas fiscais emitidas por MEI em 2023"
    //     />
    //     <DashCard
    //       title="Notas Fiscais Emitidas"
    //       value={data ? String(data["2024"]) : "0"}
    //       description="Notas fiscais emitidas por MEI em 2024"
    //     />
    //     <DashCard
    //       title="Notas Fiscais Emitidas"
    //       value={data ? String(data["2024"]) : "0"}
    //       description="Notas fiscais emitidas por MEI em 2024"
    //     />
    //   </div>
    //   <div className="grid grid-cols-1 sm:grid-cols-2  lg:gap-6 mt-6">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Notas Fiscais Emitidas por MEI</CardTitle>
    //         <CardDescription>
    //           Anos de {data ? Object.keys(data).join(", ") : ""}
    //         </CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <DashBarChart
    //           chartData={
    //             data
    //               ? Object.entries(data).map(([ano, value]) => ({
    //                   ano,
    //                   NFSE: value,
    //                 }))
    //               : []
    //           }
    //           dataKeyX="ano"
    //           barDataKey="NFSE"
    //           chartConfig={{
    //             NFSE: {
    //               label: "Notas Fiscais Emitidas",
    //               color: "#709f77",
    //             },
    //           }}
    //         />
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Notas Fiscais Emitidas por MEI</CardTitle>
    //         <CardDescription>
    //           Anos de {data ? Object.keys(data).join(", ") : ""}
    //         </CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <DashBarChart
    //           chartData={
    //             data
    //               ? Object.entries(data).map(([ano, value]) => ({
    //                   ano,
    //                   NFSE: value,
    //                 }))
    //               : []
    //           }
    //           dataKeyX="ano"
    //           barDataKey="NFSE"
    //           chartConfig={{
    //             NFSE: {
    //               label: "Notas Fiscais Emitidas",
    //               color: "#709f77",
    //             },
    //           }}
    //         />
    //       </CardContent>
    //     </Card>
    //   </div>
    // </TabsContent>
  );
};

export default NotasFiscais;
