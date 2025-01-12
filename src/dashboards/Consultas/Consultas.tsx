import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formataCNPJ } from "@/lib/utils";
import { useCSVDownloader } from "react-papaparse";
import { GridLoader } from "react-spinners";

const Consultas = () => {
  const { consulta, formData, isPending } = useConsultasState();
  const { CSVDownloader, Type } = useCSVDownloader();
  return (
    <TabsContent value="consultas" className="p-4">
      <div className="p-4 bg-red-300 mb-6">Painel Consultas</div>
      <div>
        {isPending ? (
          <GridLoader
            loading={isPending}
            color="#709f77"
            aria-label="Loading ..."
          />
        ) : (
          <Card className="max-w-md sm:max-w-2xl md:max-w-5xl lg:max-w-6xl xl:max-w-full mx-auto">
            <CardHeader className="flex flex-row justify-between items-center ">
              <div>
                {formData && formData.ni && formData.anos ? (
                  <div className="flex flex-col gap-2">
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
                <span className="text-sm text-gray-500">
                  <CSVDownloader
                    type={Type.Button}
                    data={consulta.consulta}
                    filename="consulta.csv"
                  >
                    Exportar CSV
                  </CSVDownloader>
                  {consulta.consulta.length} registros
                </span>
              </div>
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

// import Papa from "papaparse";

// const ExportCSV = ({ data }) => {
//   const handleExport = () => {
//     const csv = Papa.unparse(data);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "data.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return <button onClick={handleExport}>Export to CSV</button>;
// };
