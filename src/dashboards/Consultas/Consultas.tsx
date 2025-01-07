import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";

const Consultas = () => {
  const { consulta } = useConsultasState();
  return (
    <TabsContent value="consultas" className="p-4">
      <div className="p-4">Painel Consultas</div>
      <DataTable columns={nfseColumns} data={consulta.consulta} />
    </TabsContent>
  );
};

export default Consultas;
