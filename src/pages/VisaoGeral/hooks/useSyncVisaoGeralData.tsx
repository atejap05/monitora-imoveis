import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVisaoGeralFiltersState } from "@/state/visaoGeralFiltersState";
import { fetchNotasFiscais, fetchDistribuicaoFrequencia } from "@/service";
import { TVisaoGeral } from "@/@types";

export const useSyncVisaoGeralData = () => {
  const { submittedFilters, setLoading, setData, setError } =
    useVisaoGeralFiltersState();

  console.log(
    "Hook useSyncVisaoGeralData montado. Filtros submetidos iniciais:",
    submittedFilters
  );

  // Use React Query para buscar os dados, acionado pela mudança em `submittedFilters`
  const { isLoading, isError, error, data } = useQuery<TVisaoGeral, Error>({
    // A chave da query inclui os filtros. O React Query refaz a busca quando a chave muda.
    queryKey: ["visaoGeralData", submittedFilters],

    // A função de busca só é executada se `submittedFilters` não for nulo.
    queryFn: async () => {
      console.log(
        "React Query iniciando busca com os filtros:",
        submittedFilters
      );
      if (!submittedFilters) {
        // Não deve ser alcançado devido à opção `enabled`,
        // mas é uma boa prática de segurança.
        throw new Error("Filtros não submetidos para a busca.");
      }
      // Executa as chamadas de API em paralelo para eficiência
      const [nfseTotais, distribuicaoFrequencia] = await Promise.all([
        fetchNotasFiscais(submittedFilters),
        fetchDistribuicaoFrequencia(submittedFilters),
      ]);

      return { nfseTotais, distribuicaoFrequencia };
    },

    // A query só é ativada (enabled) quando `submittedFilters` tiver um valor.
    // Isso previne a busca automática na montagem inicial do componente.
    enabled: !!submittedFilters,

    // Configurações de caching e refetching
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false, // Evita refetchs desnecessários
    retry: 1, // Tenta novamente apenas 1 vez em caso de erro
  });

  // Efeitos para sincronizar o estado do React Query com o store Zustand
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isError) {
      setError(error);
      setData(null); // Limpa dados antigos em caso de erro
    } else {
      setError(null); // Limpa o erro em caso de sucesso
    }
  }, [isError, error, setError, setData]);

  useEffect(() => {
    // Atualiza os dados no store quando a busca do React Query for bem-sucedida
    console.log(
      "React Query retornou dados. Atualizando o store Zustand:",
      data
    );
    setData(data ?? null);
  }, [data, setData]);
};
