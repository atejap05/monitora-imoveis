import { useEffect } from "react";
import { useNotasFiscaisFiltersState } from "@/state/notasFiscaisFiltersSate";
import { fetchNotasFiscaisCanceladas } from "@/service";

export const useSyncNotasFiscaisData = () => {
    const { submittedFilters, setLoading, setError } = useNotasFiscaisFiltersState();

    useEffect(() => {
        if (!submittedFilters) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                setError(null);
                await fetchNotasFiscaisCanceladas(submittedFilters);
            } catch (error) {
                console.error("Erro ao buscar dados de notas fiscais canceladas:", error);
                setError(error instanceof Error ? error : new Error("Erro desconhecido"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [submittedFilters, setLoading, setError]);
}; 