import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { fetchContribuintesData } from "@/service";
import { TContribuintesData } from "@/@types";

export const useSyncContribuintesData = () => {
    const { submittedFilters, setLoading, setData, setError } =
        useContribuintesFiltersState();

    const { isLoading, isError, error, data, isSuccess } = useQuery<
        TContribuintesData,
        Error
    >({
        queryKey: ["contribuintesData", submittedFilters],

        queryFn: async () => {
            if (!submittedFilters) {
                throw new Error("Filtros não submetidos para a busca.");
            }
            console.log(
                "[useSyncContribuintesData] Filtros enviados para o backend:",
                submittedFilters
            );

            const contribuintesData = await fetchContribuintesData(submittedFilters);
            return contribuintesData;
        },

        enabled: !!submittedFilters,
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
        retry: 1,
    });

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (isSuccess) {
            setData(data ?? null);
            setError(null);
        }
    }, [isSuccess, data, setData, setError]);

    useEffect(() => {
        if (isError) {
            setError(error);
            setData(null); // Limpa dados antigos em caso de erro
        }
    }, [isError, error, setError, setData]);
}; 