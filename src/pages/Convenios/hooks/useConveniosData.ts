import { useQuery } from "@tanstack/react-query";
import { fetchRelatrioConvenios } from "@/service";

export const useConveniosData = () => {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["relatorioConvenios"],
    queryFn: fetchRelatrioConvenios,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
