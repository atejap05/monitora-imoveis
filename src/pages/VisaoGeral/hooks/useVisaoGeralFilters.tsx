/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotasFiscais, fetchNotasFiscaisMeiAmbiente } from "@/service";
import type {
  TConsultaNFSeTotais,
  TFormData,
  TConsultaNFSeTotaisMeiAmbiente,
} from "@/@types";
import { setFormData, YEARS } from "@/lib/utils";

// Contexto
interface VisaoGeralFiltersContextType {
  selectedOption: string;
  setSelectedOption: (v: string) => void;
  selectedMunicipio: string | null;
  setSelectedMunicipio: (v: string | null) => void;
  selectedUF: string | null;
  selectedRegiao: string | null;
  handleSubmitFilters: (formDataFromFilterComponent: any) => void;
  nfseTotaisData: TConsultaNFSeTotais | undefined;
  meiAmbienteData: TConsultaNFSeTotaisMeiAmbiente | undefined;
  isLoading: boolean;
  errorNfseTotais: Error | null;
  errorMeiAmbiente: Error | null;
}

const VisaoGeralFiltersContext = createContext<
  VisaoGeralFiltersContextType | undefined
>(undefined);

export const VisaoGeralFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}): React.ReactElement => {
  const [selectedOption, setSelectedOption] = useState("todos");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(
    null
  );
  const [formData, setFormDataState] = useState<TFormData | null>(null);
  const [selectedUF, setSelectedUF] = useState<string | null>(null);
  const [selectedRegiao, setSelectedRegiao] = useState<string | null>(null);

  const handleSubmitFilters = useCallback(
    (formDataFromFilterComponent: any) => {
      const processedFormData = setFormData(
        formDataFromFilterComponent,
        selectedOption
      );
      const finalFormData: TFormData = {
        ...processedFormData,
        municipio:
          selectedOption === "municipio"
            ? formDataFromFilterComponent.municipio || selectedMunicipio
            : processedFormData.municipio,
      };
      console.log("[VisaoGeral] Filtros enviados ao aplicar:", finalFormData);
      setFormDataState(finalFormData);
      // Atualiza UF e Região para o dashboard
      if (selectedOption === "uf") {
        setSelectedUF(formDataFromFilterComponent.uf || null);
      } else if (selectedOption === "regiao") {
        setSelectedRegiao(formDataFromFilterComponent.regiao || null);
      } else {
        setSelectedUF(null);
        setSelectedRegiao(null);
      }
    },
    [selectedOption, selectedMunicipio]
  );

  // Log dos filtros enviados ao backend na montagem e a cada mudança
  React.useEffect(() => {
    const params = formData ?? {
      filtro: "todos",
      anos: YEARS,
      regiao: null,
      municipio: null,
      uf: null,
    };
    console.log(
      "[VisaoGeral] Filtros enviados ao backend (React Query):",
      params
    );
  }, [formData]);

  const {
    data: nfseTotaisData,
    isLoading: isLoadingNfseTotais,
    error: errorNfseTotais,
  } = useQuery<TConsultaNFSeTotais, Error>({
    queryKey: [
      "visaoGeralNfseTotais",
      formData?.filtro ?? "todos",
      (formData?.anos ?? YEARS).join(","),
      formData?.regiao ?? null,
      formData?.municipio ?? null,
      formData?.uf ?? null,
    ],
    queryFn: () => {
      const params = formData ?? {
        filtro: "todos",
        anos: YEARS,
        regiao: null,
        municipio: null,
        uf: null,
      };
      return fetchNotasFiscais(params);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const {
    data: meiAmbienteData,
    isLoading: isLoadingMeiAmbiente,
    error: errorMeiAmbiente,
  } = useQuery<TConsultaNFSeTotaisMeiAmbiente, Error>({
    queryKey: [
      "visaoGeralMeiAmbiente",
      formData?.filtro ?? "todos",
      (formData?.anos ?? YEARS).join(","),
      formData?.regiao ?? null,
      formData?.municipio ?? null,
      formData?.uf ?? null,
    ],
    queryFn: () => {
      const params = formData ?? {
        filtro: "todos",
        anos: YEARS,
        regiao: null,
        municipio: null,
        uf: null,
      };
      return fetchNotasFiscaisMeiAmbiente(params);
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return (
    <VisaoGeralFiltersContext.Provider
      value={{
        selectedOption,
        setSelectedOption,
        selectedMunicipio,
        setSelectedMunicipio,
        selectedUF,
        selectedRegiao,
        handleSubmitFilters,
        nfseTotaisData,
        meiAmbienteData,
        isLoading: isLoadingNfseTotais || isLoadingMeiAmbiente,
        errorNfseTotais: errorNfseTotais ?? null,
        errorMeiAmbiente: errorMeiAmbiente ?? null,
      }}
    >
      {children}
    </VisaoGeralFiltersContext.Provider>
  );
};

export const useVisaoGeralFilters = () => {
  const ctx = useContext(VisaoGeralFiltersContext);
  if (!ctx)
    throw new Error(
      "useVisaoGeralFilters deve ser usado dentro do VisaoGeralFiltersProvider"
    );
  return ctx;
};
