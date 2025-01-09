import { TabsContent } from "@/components/ui/tabs";
import { nfseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useConsultasState } from "@/state/consultasState";

const Consultas = () => {
  const { consulta, formData } = useConsultasState();
  return (
    <TabsContent value="consultas" className="p-4">
      <div className="p-4">Painel Consultas</div>
      <div>
        <span>NI: {formData.ni}</span>
        <span>Ano: {formData.ano}</span>
      </div>
      {consulta.consulta.length > 0 && (
        <DataTable columns={nfseColumns} data={consulta.consulta} />
      )}
    </TabsContent>
  );
};

export default Consultas;
