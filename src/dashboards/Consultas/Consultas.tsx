import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Consultas = () => {
  const { consulta, formData } = useConsultasState();
  return (
    <TabsContent value="consultas" className="p-4">
      <div className="p-4">Painel Consultas</div>
      {consulta.consulta.length > 0 && (
        <Card>
          <CardHeader>
            <div>
              <span>NI: {formData.ni}</span>
              <span>Ano: {formData.anos}</span>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={nfseColumns} data={consulta.consulta} />
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default Consultas;
