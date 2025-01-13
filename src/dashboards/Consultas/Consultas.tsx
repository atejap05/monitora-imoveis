import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formataCNPJ } from "@/lib/utils";
import { useCSVDownloader } from "react-papaparse";
import { GridLoader } from "react-spinners";
import csv_icon from "@/assets/csv.png";
import xlsx_icon from "@/assets/xlsx.png";
import BasicTooltip from "@/components/BasicTooltip";
import { setFileName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { exportXLSX } from "@/lib/utils";

const Consultas = () => {
  const { consulta, formData, isPending } = useConsultasState();
  const { CSVDownloader, Type } = useCSVDownloader();
  return (
    <TabsContent value="consultas" className="p-4">
      <div>
        {isPending ? (
          <GridLoader
            loading={isPending}
            color="#709f77"
            aria-label="Loading ..."
          />
        ) : (
          <Card className="max-w-md sm:max-w-2xl md:max-w-5xl lg:max-w-6xl xl:max-w-full mx-auto">
            {/* TODO: Separar CardHeader em arquivo  */}
            <CardHeader className="flex flex-row justify-between items-center ">
              <div>
                {formData && formData.ni && formData.anos ? (
                  <div className="flex justify-start gap-2">
                    <Badge className="text-sm place-content-center tracking-wide">
                      {formataCNPJ(formData.ni)}
                    </Badge>
                    <div className="flex flex-row gap-2">
                      {formData.anos.map(ano => (
                        <Badge key={ano}>{ano}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span>Pesquisa não retornou resultados.</span>
                  </div>
                )}
              </div>
              <div>
                <span>
                  <span className="text-lg font-mono font-semibold tracking-wide text-gray-500">
                    {consulta.consulta.length}
                  </span>{" "}
                  registro(s) encontrado(s).
                </span>
              </div>
              {consulta.consulta.length > 0 && (
                <div className="flex flex-row gap-3">
                  <span className="text-sm text-gray-500">
                    <CSVDownloader
                      type={Type.Button}
                      data={consulta.consulta}
                      filename={setFileName(
                        formData?.ni ?? "",
                        formData?.anos ?? []
                      )}
                    >
                      <BasicTooltip
                        content="Exportar CSV"
                        label={
                          <Button
                            variant={"outline"}
                            size={"icon"}
                            className="shadow-sm"
                          >
                            <img src={csv_icon} alt="csv" className="w-6 h-6" />
                          </Button>
                        }
                      />
                    </CSVDownloader>
                  </span>
                  <span>
                    <BasicTooltip
                      content="Exportar XLSX"
                      label={
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => exportXLSX(consulta.consulta)}
                          className="shadow-sm"
                        >
                          <img src={xlsx_icon} alt="xlsx" className="w-6 h-6" />
                        </Button>
                      }
                    />
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <DataTable columns={nfseColumns} data={consulta.consulta} />
            </CardContent>
          </Card>
        )}
      </div>
    </TabsContent>
  );
};

export default Consultas;
