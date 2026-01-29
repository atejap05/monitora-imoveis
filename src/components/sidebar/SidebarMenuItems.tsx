import { VisaoGeralFilters } from "@/pages/VisaoGeral/components";
import { NotasFiscaisFilters } from "@/pages/NotasFiscais/components/NotasFiscaisFilters";
import { FormConsultas } from "@/pages/Consultas/components/FormConsultas";
import { FormConsultaChave } from "@/pages/Consultas/components/FormConsultaChave";
import { useConsultasState } from "@/state/consultasState";
import { useLocation } from "react-router-dom";
import { ConveniosFiltersWrapper } from "@/pages/Convenios/components/ConveniosFiltersWrapper";
import { AmbienteFilters } from "@/pages/Ambiente/components/AmbienteFilters";
import { ContribuintesFilters } from "@/pages/Contribuintes/components/ContribuintesFilters";
import { VolumetriaFilters } from "@/pages/Volumetria/components/VolumetriaFilters";

export const SidebarMenuItems = () => {
  const location = useLocation();
  // Chame todos os hooks no topo, SEM condicional
  const consultasState = useConsultasState();

  switch (location.pathname) {
    case "/visao-geral":
      return <VisaoGeralFilters />;
    case "/consultas": {
      const {
        isLoading,
        modoConsulta,
        submitConsulta,
        setChaveAcesso,
      } = consultasState;

      if (modoConsulta === "chave") {
        return (
          <FormConsultaChave
            onSubmit={(chave) => {
              setChaveAcesso(chave);
            }}
            isPending={isLoading}
          />
        );
      }

      return (
        <FormConsultas
          onSubmit={(ni, anos) => submitConsulta({ ni, anos })}
          isPending={isLoading}
        />
      );
    }
    case "/convenios": {
      // Usar wrapper que só carrega o hook quando necessário
      return <ConveniosFiltersWrapper />;
    }
    case "/notas-fiscais":
      return <NotasFiscaisFilters />;
    case "/ambiente":
      return <AmbienteFilters />;
    case "/contribuintes":
      return <ContribuintesFilters />;
    case "/volumetria":
      return <VolumetriaFilters />;
    default:
      return null;
  }
};

export default SidebarMenuItems;
