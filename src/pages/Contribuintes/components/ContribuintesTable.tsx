import { useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useContribuintesFiltersState } from "@/state/contribuintesFiltersState";
import { TContribuinte } from "@/@types";
import { formatCurrency, formataCNPJ } from "@/lib/utils";

// Definição das colunas da tabela
const columns: ColumnDef<TContribuinte>[] = [
    {
        accessorKey: "fc001_xnome",
        header: "Nome do Contribuinte",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("fc001_xnome")}</div>
        ),
    },
    {
        accessorKey: "fc001_ni",
        header: "CNPJ/CPF",
        cell: ({ row }) => (
            <div className="font-mono text-sm">
                {formataCNPJ(row.getValue("fc001_ni"))}
            </div>
        ),
    },
    {
        accessorKey: "fc010_uf_descricao",
        header: "UF",
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {row.getValue("fc010_uf_descricao")}
            </div>
        ),
    },
    {
        accessorKey: "fc010_cmun_descricao",
        header: "Município",
        cell: ({ row }) => <div>{row.getValue("fc010_cmun_descricao")}</div>,
    },
    {
        accessorKey: "fh030_opsimpnac_descricao",
        header: "Tipo",
        cell: ({ row }) => {
            const tipo = row.getValue("fh030_opsimpnac_descricao") as string;
            let colorClass = "";
            switch (tipo) {
                case "MEI":
                    colorClass = "bg-blue-100 text-blue-800";
                    break;
                case "ME/EPP":
                    colorClass = "bg-green-100 text-green-800";
                    break;
                case "Não Optante":
                    colorClass = "bg-purple-100 text-purple-800";
                    break;
                default:
                    colorClass = "bg-gray-100 text-gray-800";
            }
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {tipo}
                </span>
            );
        },
    },
    {
        accessorKey: "total_notas",
        header: "Total de Notas",
        cell: ({ row }) => (
            <div className="text-center font-medium">
                {(row.getValue("total_notas") as number).toLocaleString()}
            </div>
        ),
    },
    {
        accessorKey: "faturamento_total",
        header: "Faturamento Total",
        cell: ({ row }) => (
            <div className="text-right font-medium">
                {formatCurrency(row.getValue("faturamento_total"))}
            </div>
        ),
    },
];

export const ContribuintesTable = () => {
    const { data, isLoading } = useContribuintesFiltersState();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [sorting, setSorting] = useState<SortingState>([
        { id: "faturamento_total", desc: true }, // Ordena por faturamento por padrão
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const tableData = data?.contribuintes || [];

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
            sorting,
            columnFilters,
        },
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Contribuintes</CardTitle>
                    <CardDescription>
                        Contribuintes que correspondem aos filtros aplicados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">
                            Carregando tabela...
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Contribuintes</CardTitle>
                <CardDescription>
                    {tableData.length} contribuintes encontrados
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            <div className="flex items-center gap-1">
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? "cursor-pointer select-none flex items-center gap-1"
                                                                : ""
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: <ArrowUpIcon className="h-4 w-4" />,
                                                            desc: <ArrowDownIcon className="h-4 w-4" />,
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                    </div>
                                                )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Nenhum resultado encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4">
                    <Pagination
                        table={table}
                        slice={5}
                    />
                </div>
            </CardContent>
        </Card>
    );
}; 