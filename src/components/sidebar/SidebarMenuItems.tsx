import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { useLocation } from "react-router-dom";

export const SidebarMenuItems = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    // Adicione outros cases conforme necessário, por exemplo:
    // case "/outra-pagina":
    //   return <OutroComponente />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
