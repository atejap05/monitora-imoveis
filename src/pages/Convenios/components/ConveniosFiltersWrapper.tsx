import { ConveniosFilters } from "./ConveniosFilters";
import { useConveniosData } from "../hooks/useConveniosData";

/**
 * Wrapper que só carrega o hook useConveniosData quando o componente é montado
 * Evita criação prematura da query no React Query DevTools
 */
export const ConveniosFiltersWrapper = () => {
    const conveniosData = useConveniosData();
    const { status } = conveniosData;
    const isLoading = status !== "success";

    return <ConveniosFilters isLoading={isLoading} />;
}; 