import { TabsContent } from "@/components/ui/tabs";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
import { prepareData } from "@/lib/utils";

const NotasFiscais = () => {
  const { consultaNFSeTotais, isPending, submitedNFSeFormData } =
    useNotasFiscaisState();
  const chartData = prepareData(consultaNFSeTotais);

  const dashboardDisplayTitle = () => {
    const { filtro, regiao, municipio, uf } = submitedNFSeFormData;
    const anos = chartData.map(chart => chart.year).join(", ");

    if (filtro === "todos")
      return `Notas Fiscais de Serviços emitidas no Brasil em ${anos}`;
    if (filtro === "uf")
      return `Notas Fiscais de Serviços emitidas em ${uf} em ${anos}`;
    if (filtro === "municipio")
      return `Notas Fiscais de Serviços emitidas em ${municipio} em ${anos}`;
    if (filtro === "regiao")
      return `Notas Fiscais de Serviços emitidas na região ${regiao} em ${anos}`;
  };

  return (
    <TabsContent value="nfse" className="pl-4 py-6">
      <div>
        <h2 className="text-2xl font-bold text-green">
          {dashboardDisplayTitle()}
        </h2>
      </div>

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
