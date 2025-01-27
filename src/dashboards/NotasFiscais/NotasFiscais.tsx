import { TabsContent } from "@/components/ui/tabs";
import { useNotasFiscaisState } from "@/state/notasFiscaisState";
import { HashLoader } from "react-spinners";
import { PieChartNFSe } from "./PieChartNFSe";
import { prepareData } from "@/lib/utils";

const NotasFiscais = () => {
  const { consultaNFSeTotais, isPending } = useNotasFiscaisState();

  const chartData = prepareData(consultaNFSeTotais);

  return (
    <TabsContent value="nfse" className=" pl-4 py-6">
      <div>nfse</div>

      {isPending ? (
        <div className="flex flex-col justify-center items-center gap-3 h-96">
          <HashLoader
            loading={isPending}
            color="#709f77"
            aria-label="Loading ..."
          />

          <span className="text-green animate-pulse">
            Consultado o Receita Data ...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4">
          {chartData.map((chart, index) => (
            <PieChartNFSe key={index} chartData={chart.data} ano={chart.year} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default NotasFiscais;
