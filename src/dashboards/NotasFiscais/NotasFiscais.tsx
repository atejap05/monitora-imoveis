import { TabsContent } from "@/components/ui/tabs";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
import { prepareData } from "@/lib/utils";
import BasicLoading from "@/components/BasicLoading";

const NotasFiscais = () => {
  const { consultaNFSeTotais, isPending, submitedNFSeFormData } =
    useNotasFiscaisState();
  const chartData = prepareData(consultaNFSeTotais);

  //TODO: Move this to a utils function
  const dashboardDisplayTitle = () => {
    const { filtro, regiao, municipio, uf } = submitedNFSeFormData;
    const anos = chartData.map(chart => chart.year).join(", ");

    if (filtro === "todos")
      return `Notas Fiscais de Serviço emitidas no Brasil em ${anos}`;
    if (filtro === "uf")
      return `Notas Fiscais de Serviço emitidas em ${uf} em ${anos}`;
    if (filtro === "municipio")
      return `Notas Fiscais de Serviço emitidas em ${municipio} em ${anos}`;
    if (filtro === "regiao")
      return `Notas Fiscais de Serviço emitidas na região ${regiao} em ${anos}`;
  };

  return (
    <TabsContent value="nfse" className="mx-auto pl-4 py-6">
      {isPending ? (
        <BasicLoading
          loading={isPending}
          color={"#00A478"}
          size={50}
          Loader={HashLoader}
          label="Carregando dados do RD ..."
        />
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green">
              {dashboardDisplayTitle()}
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center gap-8 sm:flex-row sm:gap-4 ">
            {chartData.map((chart, index) => (
              <PieChartNFSe
                key={index}
                chartData={chart.data}
                ano={chart.year}
              />
            ))}
          </div>
        </>
      )}
    </TabsContent>
  );
};

export default NotasFiscais;
