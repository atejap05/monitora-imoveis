import Consultas from "./Consultas";
import Contribuintes from "./Contribuintes";
import NotasFiscais from "./NotasFiscais";
import VisaoGeral from "./VisaoGeral";

type DashboardProps = {
  tabValue: string;
};
const Dashboard = ({ tabValue }: DashboardProps) => {
  const renderComponent = () => {
    switch (tabValue) {
      case "visao-geral":
        return <VisaoGeral />;
      case "nfse":
        return <NotasFiscais />;
      case "contribuintes":
        return <Contribuintes />;
      case "consultas":
        return <Consultas />;
      default:
        return <VisaoGeral />;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default Dashboard;
