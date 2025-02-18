import { TabsContent } from "@/components/ui/tabs";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
import { BarChartNFSe } from "./BarChartNFSe";
import { prepareData } from "@/lib/utils";
import BasicLoading from "@/components/BasicLoading";
import { BasicTable } from "./BasicTable";

const NotasFiscais = () => {
  const {
    consultaNFSeTotais,
    consultaNFSeTotaisIsPending,
    submitedNFSeFormData,
    consutaNFSeTotaisMeiAmbiente,
    consultaMeiAmbienteIsPending,
  } = useNotasFiscaisState();
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
      {consultaNFSeTotaisIsPending ? (
        <BasicLoading
          loading={consultaNFSeTotaisIsPending}
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
      <div className="mt-8 w-full h-full">
        <h2 className="text-2xl font-bold text-green">
          Notas Fiscais por Município
        </h2>
        {consultaMeiAmbienteIsPending ? (
          <BasicLoading
            loading={consultaMeiAmbienteIsPending}
            color={"#00A478"}
            size={50}
            Loader={HashLoader}
            label="Carregando dados do IBGE ..."
          />
        ) : (
          <div className="flex  gap-4">
            <div className="flex-1">
              <BarChartNFSe chartData={consutaNFSeTotaisMeiAmbiente} />
            </div>
            <div className="flex-1">
              <BasicTable
                data={consutaNFSeTotaisMeiAmbiente}
                headers={[
                  "Ano",
                  "APP",
                  "Web",
                  "Web Service",
                  "Sistema Próprio",
                ]}
                description="NFSe MEI por ambiente de emissão"
              />
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default NotasFiscais;
