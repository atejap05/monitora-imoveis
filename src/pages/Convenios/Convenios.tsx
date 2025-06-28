import React, { useMemo, useState } from "react";
import { useConveniosData } from "./hooks/useConveniosData";
import { conveniosColumns } from "./components/columns";
import { DataTable } from "@/components/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { MunicipioStatus } from "@/@types";
import { Checkbox } from "@/components/ui/checkbox";
import { ConveniosTableToolbar } from "./components/ConveniosTableToolbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Database } from "lucide-react";
import BasicLoading from "@/components/BasicLoading";
import { ClipLoader } from "react-spinners";

const Convenios: React.FC = () => {
  const { status, data, error } = useConveniosData();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<MunicipioStatus>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...conveniosColumns,
    ],
    []
  );

  const tableData = useMemo(() => data ?? [], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
  });

  const getExportData = () => {
    const formatDataForExport = (rows: MunicipioStatus[]) => {
      return rows.map((row) => ({
        ...row,
        UltimaAtividade: row.UltimaAtividade
          ? new Date(row.UltimaAtividade).toLocaleDateString("pt-BR")
          : "N/A",
      }));
    };

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      return formatDataForExport(selectedRows.map((row) => row.original));
    }
    return formatDataForExport(data ?? []);
  };

  const hasData = !!(data && data.length > 0);
  const isLoading = status === "loading";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Informações sobre Convênios</h1>
        <p className="text-sm text-gray-500">
          Informações sobre os convênios celebrados entre municípios e a
          Receita Federal do Brasil (RFB).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Convênios</CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
            Relatório gerado com dados da{" "}
            <span className="inline-flex items-center gap-1">
              <Database className="w-4 h-4 text-yellow-500" />
              API SEFIN
            </span>{" "}
            e do{" "}
            <span className="inline-flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-yellow-500" />
              Receita Data
            </span>
          </CardDescription>
          <ConveniosTableToolbar
            table={table}
            getExportData={getExportData}
            hasData={hasData && status === 'success'}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-80 gap-3">
              <BasicLoading
                Loader={ClipLoader}
                loading={isLoading}
                label="Carregando dados..."
                size={50}
                color="#3498db"
              />
            </div>
          ) : status === 'error' ? (
            <div className="text-red-500 text-center">
              Ocorreu um erro ao buscar os dados.
              {error && (
                <pre className="mt-2 text-left whitespace-pre-wrap">
                  {error}
                </pre>
              )}
            </div>
          ) : status === 'success' ? (
            <DataTable table={table} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Convenios;
