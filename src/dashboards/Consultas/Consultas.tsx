import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { GridLoader } from "react-spinners";

const Consultas = () => {
  const { consulta, formData, isPending } = useConsultasState();
  return (
    <TabsContent value="consultas" className="p-4">
      <div className="p-4">Painel Consultas</div>
      {isPending ? (
        <GridLoader
          loading={isPending}
          color="#709f77"
          aria-label="Loading ..."
        />
      ) : (
        <Card className="max-w-7xl mx-auto">
          <CardHeader>
            {formData && formData.ni && formData.anos ? (
              <div>
                <span>NI: {formData.ni}</span>
                <span>Ano: {formData.anos}</span>
              </div>
            ) : (
              <div>
                <span>Pesquisa não retornou resultados.</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <DataTable columns={nfseColumns} data={consulta?.consulta} />
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default Consultas;
