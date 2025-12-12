import { useQuery } from "@tanstack/react-query";
import { fetchRelatrioConvenios } from "@/service";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queuedBackendCall } from "@/lib/backendQueue";

export const useConveniosData = () => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: QUERY_KEYS.conveniosRelatorio(),
    queryFn: () => queuedBackendCall(() => fetchRelatrioConvenios(), "normal"),
    // staleTime removido - usar configuração global de 1 hora
    enabled: false, // Impede a execução automática da consulta
  });

  const status = isLoading
    ? "loading"
    : isError
    ? "error"
    : isSuccess
    ? "success"
    : "idle";

  return {
    status,
    data,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
