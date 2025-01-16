import { TabsContent } from "@/components/ui/tabs";
import DashCard from "@/components/DashCard";
import DashChart from "@/components/DashChart";
import { useQuery } from "@tanstack/react-query";

type NotasFiscaisMeiPorAno = Record<string, number>;

const fetchNotasFiscaisMeiPorAno = async () => {
  const response = await fetch(
    "https://localhost:8443/ctx/once/PainelNFSe/get_total_nfse_emitidas_por_mei_por_ano?anos=2022,2023,2024"
  );
  return response.json() as Promise<NotasFiscaisMeiPorAno>;
};

const NotasFiscais = () => {
  const { data, status } = useQuery({
    queryKey: ["nfse_mei_por_ano"],
    queryFn: fetchNotasFiscaisMeiPorAno,
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <TabsContent value="nfse">
      <div className="grid grid-cols-4 gap-4 lg:gap-6">
        <DashCard
          title="Notas Fiscais Emitidas"
          value={data ? String(data["2022"]) : "0"}
          description="Notas fiscais emitidas por MEI em 2022"
        />
        <DashCard
          title="Notas Fiscais Emitidas"
          value={data ? String(data["2023"]) : "0"}
          description="Notas fiscais emitidas por MEI em 2023"
        />
        <DashCard
          title="Notas Fiscais Emitidas"
          value={data ? String(data["2024"]) : "0"}
          description="Notas fiscais emitidas por MEI em 2024"
        />
      </div>
    </TabsContent>
  );
};

export default NotasFiscais;
