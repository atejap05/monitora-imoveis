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
import { ConveniosKpiCards } from "./components/ConveniosKpiCards";
import { ConveniosChartsSection } from "./components/ConveniosChartsSection";
import { useConveniosFiltersState } from "@/state/conveniosFiltersState";
import { ConveniosSkeleton } from "./components/ConveniosSkeleton";

const Convenios: React.FC = () => {
  const { status, data, error } = useConveniosData();
  const {
    globalFilter,
    regiaoGeografica,
    regiaoFiscal,
    status: convenioStatus,
    uf,
    setGlobalFilter,
  } = useConveniosFiltersState();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

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
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
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
      return rows.map(row => ({
        ...row,
        UltimaAtividade: row.UltimaAtividade
          ? new Date(row.UltimaAtividade).toLocaleDateString("pt-BR")
          : "N/A",
      }));
    };

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      return formatDataForExport(selectedRows.map(row => row.original));
    }
    return formatDataForExport(data ?? []);
  };

  const filteredData = useMemo(() => {
    let result = data ?? [];
    // Região Geográfica: aceita tanto sigla quanto nome completo, ignorando case e espaços
    if (regiaoGeografica) {
      result = result.filter(m => {
        if (!m.Regiao) return false;
        // Normaliza para comparar sigla e nome
        const regiaoNorm = m.Regiao.trim().toUpperCase();
        const filtroNorm = regiaoGeografica.trim().toUpperCase();
        // Aceita se for igual à sigla (N, NE, CO, SE, S) ou igual ao nome (NORTE, NORDESTE, ...)
        return (
          regiaoNorm === filtroNorm ||
          (filtroNorm === "N" && regiaoNorm.startsWith("NORTE")) ||
          (filtroNorm === "NE" && regiaoNorm.startsWith("NORDESTE")) ||
          (filtroNorm === "CO" && regiaoNorm.startsWith("CENTRO")) ||
          (filtroNorm === "SE" && regiaoNorm.startsWith("SUDESTE")) ||
          (filtroNorm === "S" && regiaoNorm.startsWith("SUL"))
        );
      });
    }
    if (regiaoFiscal)
      result = result.filter(m => m.RegiaoFiscal === regiaoFiscal);
    if (convenioStatus)
      result = result.filter(m => m.StatusConvenioSEFIN === convenioStatus);
    if (uf) result = result.filter(m => m.UF === uf);
    return result;
  }, [data, regiaoGeografica, regiaoFiscal, convenioStatus, uf, table]);

  const hasData = !!(data && data.length > 0);
  const isLoading = status === "loading";

  return (
    <div className="w-full flex-1 px-4 sm:px-6 md:px-8 py-6">
      <div className="flex flex-col items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Informações sobre Convênios</h1>
        <p className="text-sm text-gray-500">
          Informações sobre os convênios celebrados entre municípios e a Receita
          Federal do Brasil (RFB).
        </p>
      </div>
      {status === "success" && data && (
        <>
          <ConveniosKpiCards data={filteredData} />
          <ConveniosChartsSection data={filteredData} />
        </>
      )}
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
            hasData={hasData && status === "success"}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ConveniosSkeleton />
          ) : status === "error" ? (
            <div className="text-red-500 text-center">
              Ocorreu um erro ao buscar os dados.
              {error && (
                <pre className="mt-2 text-left whitespace-pre-wrap">
                  {error}
                </pre>
              )}
            </div>
          ) : status === "success" ? (
            <DataTable table={table} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Convenios;
