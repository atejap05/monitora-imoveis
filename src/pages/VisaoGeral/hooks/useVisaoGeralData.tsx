import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useVisaoGeralFilters } from "@/pages/VisaoGeral/hooks/useVisaoGeralFilters";
import { fetchDistribuicaoFrequencia } from "@/service";

export const useVisaoGeralData = () => {
  const {
    selectedOption,
    selectedMunicipio,
    selectedUF,
    selectedRegiao,
    nfseTotaisData,
  } = useVisaoGeralFilters();

  // Monta os filtros para a consulta
  const filtros = React.useMemo(() => {
    return {
      filtro: selectedOption || "todos",
      anos: nfseTotaisData ? Object.keys(nfseTotaisData) : [],
      regiao: selectedRegiao ?? null,
      municipio: selectedMunicipio ?? null,
      uf: selectedUF ?? null,
      contribuintes: ["1", "2", "3"],
      valorMin: null,
      valorMax: null,
    };
  }, [
    selectedOption,
    selectedMunicipio,
    selectedUF,
    selectedRegiao,
    nfseTotaisData,
  ]);

  // Busca distribuição de frequência com React Query
  const {
    data: distFreqData,
    isLoading: isLoadingDistFreq,
    error: errorDistFreq,
  } = useQuery({
    queryKey: ["visaoGeralDistribuicaoFrequencia", filtros],
    queryFn: async () => {
      const result = await fetchDistribuicaoFrequencia(filtros);
      console.log("[VisaoGeral] Resposta fetchDistribuicaoFrequencia:", result);
      return result;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Garante que distFreqData seja do tipo RespostaEstatistica ou undefined
  const estatisticas = distFreqData?.estatisticas;
  const metodoCalculo = distFreqData?.metodo_calculo;
  const tabelaFrequencias = distFreqData?.tabela_frequencias ?? [];

  return {
    distFreqData: tabelaFrequencias,
    estatisticas,
    metodoCalculo,
    isLoading: isLoadingDistFreq,
    error: errorDistFreq,
  };
};
