import Ambiente from "./Ambiente";
import Consultas from "./Consultas/Consultas";
import Contribuintes from "./Contribuintes";
import NotasFiscais from "./NotasFiscais/NotasFiscais";
import {
  VisaoGeralDashboard,
  VisaoGeralFilters,
} from "@/features/visao-geral/components";
import { VisaoGeralFiltersProvider } from "@/features/visao-geral/hooks/useVisaoGeralFilters";

type DashboardProps = {
  tabValue: string;
};
const Dashboard = ({ tabValue }: DashboardProps) => {
  // Apenas renderiza o conteúdo principal da tab
  switch (tabValue) {
    case "visao-geral":
      return <VisaoGeralDashboard />;
    case "nfse":
      return <NotasFiscais />;
    case "contribuintes":
      return <Contribuintes />;
    case "ambiente":
      return <Ambiente />;
    case "consultas":
      return <Consultas />;
    default:
      return <VisaoGeralDashboard />;
  }
};

export default Dashboard;
