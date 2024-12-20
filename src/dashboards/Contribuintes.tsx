import { TabsContent } from "@/components/ui/tabs";
import DashCard from "@/components/DashCard";
import DashChart from "@/components/DashChart";
import { useQuery } from "@tanstack/react-query";

const fetchTotalContribuintes = async () => {
  const response = await fetch(
    "https://localhost:8443/ctx/once/PainelNFSe/get_total_ni_distintos"
  );
  return response.json();
};
const Contribuintes = () => {
  const { data, status } = useQuery({
    queryKey: ["contribuintes"],
    queryFn: fetchTotalContribuintes,
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <TabsContent value="contribuintes">
      <div className="grid grid-cols-4 gap-4 lg:gap-6 p-4">
        <DashCard
          title="Total Contribuintes"
          value={data.total_ni_distintos.toLocaleString("pt-BR")}
          description="Variação percentual"
        />
        {/* <DashCard />
        <DashCard />
        <DashCard /> */}
        <div className="col-span-4 h-96 flex items-center justify-center">
          <DashChart />
        </div>
        <div className="col-span-4 overflow-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  N o
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  01/01/2023
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  123
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  R$ 100,00
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  Emitida
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  01/01/2023
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  123
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  R$ 100,00
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  Emitida
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </TabsContent>
  );
};

export default Contribuintes;
