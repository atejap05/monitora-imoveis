import React, { useMemo, useState } from "react";
import { useConveniosData } from "./hooks/useConveniosData";
import { getConveniosColumnsWithSelect } from "./components/columnsWithSelection";
import { DataTable } from "@/components/DataTable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ConveniosTableToolbar } from "./components/ConveniosTableToolbar";
import { ConveniosWelcome } from "./components/ConveniosWelcome";
import { ConveniosError } from "./components/ConveniosError";
import { formatDataForExport } from "./utils/export";
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
import {
  CONTAINER_MAX_WIDTH,
  RESPONSIVE_PADDING,
  RESPONSIVE_GAP,
} from "@/lib/constants";

const Convenios: React.FC = () => {
  const { status, data, error, refetch } = useConveniosData();
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

  const columns = useMemo(getConveniosColumnsWithSelect, []);
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

  const [consultaIniciada, setConsultaIniciada] = useState(
    () => !!(data && data.length > 0)
  );

  const getExportData = () => {
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

  return (
    <div className={`${CONTAINER_MAX_WIDTH} ${RESPONSIVE_PADDING} py-6`}>
      <div className="text-center mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Informações sobre Convênios
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-2">
          Visualize indicadores, gráficos e relatórios sobre os convênios
          celebrados entre municípios e a Receita Federal do Brasil (RFB).
        </p>
      </div>

      {!consultaIniciada && (
        <ConveniosWelcome
          onConsultar={() => {
            setConsultaIniciada(true);
            if (!(data && data.length > 0)) {
              refetch();
            }
          }}
        />
      )}

      {consultaIniciada && (
        <div className={`flex flex-col ${RESPONSIVE_GAP}`}>
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
              {status === "loading" ? (
                <ConveniosSkeleton />
              ) : status === "error" ? (
                <ConveniosError error={error} />
              ) : status === "success" ? (
                <DataTable table={table} />
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Convenios;
