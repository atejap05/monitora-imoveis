import VisaoGeralDashboard from "./components/VisaoGeralDashboard";
import { useSyncVisaoGeralData } from "./hooks/useSyncVisaoGeralData";

const VisaoGeral = () => {
  // Hook para sincronizar os dados do dashboard com o estado de filtros
  useSyncVisaoGeralData();

  return <VisaoGeralDashboard />;
};

export default VisaoGeral;
