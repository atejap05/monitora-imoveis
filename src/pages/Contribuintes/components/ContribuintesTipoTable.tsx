import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { useMemo } from "react";
import { formatNumber } from "@/lib/utils";
import { BasicTable } from "@/components/BasicTable";

export const ContribuintesTipoTable = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const tableData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return [];
        }

        return data.map((item) => ({
            tipo: item.tipo_contribuinte,
            tomadores: item.total_tomadores,
            prestadores: item.total_prestadores,
            intermediarios: item.total_intermediarios,
            total: item.total_tomadores + item.total_prestadores + item.total_intermediarios,
        }));
    }, [data]);

    const columns = [
        {
            header: "Tipo de Contribuinte",
            key: "tipo",
            align: "left" as const,
        },
        {
            header: "Tomadores",
            key: "tomadores",
            align: "right" as const,
            format: (value: string | number) => formatNumber(value as number),
        },
        {
            header: "Prestadores",
            key: "prestadores",
            align: "right" as const,
            format: (value: string | number) => formatNumber(value as number),
        },
        {
            header: "Intermediários",
            key: "intermediarios",
            align: "right" as const,
            format: (value: string | number) => formatNumber(value as number),
        },
        {
            header: "Total",
            key: "total",
            align: "right" as const,
            format: (value: string | number) => formatNumber(value as number),
            className: "font-semibold",
        },
    ];

    if (isLoading) {
        return (
            <div className="w-full bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Detalhamento por Tipo de Contribuinte</h3>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!tableData.length) {
        return (
            <div className="w-full bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Detalhamento por Tipo de Contribuinte</h3>
                <div className="text-center text-gray-500 py-8">
                    Nenhum dado disponível
                </div>
            </div>
        );
    }

    return (
        <BasicTable
            title="Detalhamento por Tipo de Contribuinte"
            data={tableData}
            columns={columns}
            className="w-full"
        />
    );
}; 