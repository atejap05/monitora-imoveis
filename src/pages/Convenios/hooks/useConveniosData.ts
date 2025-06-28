import { useQuery } from "@tanstack/react-query";
import { fetchRelatrioConvenios } from "@/service";

export const useConveniosData = () => {
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["relatorioConvenios"],
    queryFn: fetchRelatrioConvenios,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Mapeia o status do useQuery para o status que o componente espera, se necessário,
  // ou pode-se refatorar o componente para usar diretamente isLoading, isError, isSuccess.
  // Por simplicidade aqui, vamos apenas retornar os valores do useQuery.
  
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