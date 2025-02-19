import { TabsContent } from "@/components/ui/tabs";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
import { BarChartNFSe } from "./BarChartNFSe";
import { dashboardDisplayTitle, prepareData } from "@/lib/utils";
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

  const { filtro, regiao, municipio, uf } = submitedNFSeFormData;

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
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green">
              {dashboardDisplayTitle(
                "Totais NFSe",
                filtro || "",
                uf || "",
                municipio || "",
                regiao || "",
                chartData
              )}
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
        </div>
      )}
      <div className="mt-8 w-full h-full">
        {consultaMeiAmbienteIsPending ? (
          <BasicLoading
            loading={consultaMeiAmbienteIsPending}
            color={"#00A478"}
            size={50}
            Loader={HashLoader}
            label="Carregando dados do RD ..."
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green mb-4">
              {dashboardDisplayTitle(
                "NFSe MEI por ambiente de emissão",
                filtro || "",
                uf || "",
                municipio || "",
                regiao || "",
                chartData
              )}
            </h2>
            <div className="flex gap-4">
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
          </>
        )}
      </div>
    </TabsContent>
  );
};

export default NotasFiscais;
