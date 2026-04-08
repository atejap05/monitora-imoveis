import { nfseColumns, defaultColumnVisibility, columnDisplayNames } from "./components/columns";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formataCNPJ } from "@/lib/utils";
import { useCSVDownloader } from "react-papaparse";
import { BarLoader } from "react-spinners";
import csv_icon from "@/assets/csv.png";
import xlsx_icon from "@/assets/xlsx.png";
import BasicTooltip from "@/components/BasicTooltip";
import { setFileName, exportXLSX } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useConsultasState } from "@/state/consultasState";
import { useConsultaPorChave } from "./hooks/useConsultaPorChave";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateAndDownloadPdf, buildReportFilename } from "@/lib/pdf";
import { ConsultasReport } from "./report/ConsultasReport";
import { ModoConsultaToggle } from "./components/ModoConsultaToggle";
import { NfseDetalhada } from "./components/NfseDetalhada";
import { PAGE_SHELL_CLASSES, RESPONSIVE_GAP } from "@/lib/constants";

const Consultas = () => {
  const {
    consulta,
    formData,
    isLoading,
    modoConsulta,
    chaveAcesso,
    nfseDetalhada,
    setNfseDetalhada,
  } = useConsultasState();

  // Hook para consulta por chave
  const {
    data: nfsePorChave,
    isLoading: isLoadingChave,
    isError: isErrorChave,
    error: errorChave,
  } = useConsultaPorChave(chaveAcesso, modoConsulta === "chave");

  // Sincroniza dados da consulta por chave com o estado
  useEffect(() => {
    if (modoConsulta === "chave") {
      if (nfsePorChave !== undefined) {
        setNfseDetalhada(nfsePorChave);
      }
      if (isErrorChave) {
        setNfseDetalhada(null);
        toast.error(
          errorChave?.message || "Erro ao consultar NFSe por chave de acesso"
        );
      }
    }
  }, [nfsePorChave, isErrorChave, errorChave, modoConsulta, setNfseDetalhada]);

  const { CSVDownloader, Type } = useCSVDownloader();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(defaultColumnVisibility);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isPending = modoConsulta === "cnpj" ? isLoading : isLoadingChave;

  const handleGenerateReport = async () => {
    if (consulta.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const filename = buildReportFilename("consultas", {
        cnpj: formData.ni,
      });
      await generateAndDownloadPdf(
        <ConsultasReport
          data={consulta}
          cnpj={formData.ni}
          anos={formData.anos}
        />,
        filename,
      );
      toast.success("Relatório PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar relatório PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const table = useReactTable({
    data: consulta,
    columns: nfseColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
  });

  return (
    <div className={PAGE_SHELL_CLASSES}>
      <h1 className="text-2xl text-center font-semibold text-gray-800 mb-4 md:mb-6 lg:mb-8">
        Consulta Contribuinte
      </h1>
      <div className={`flex flex-col ${RESPONSIVE_GAP}`}>
        <ModoConsultaToggle />

        {modoConsulta === "chave" ? (
          <NfseDetalhada nfse={nfseDetalhada} isLoading={isPending} />
        ) : isPending ? (
          <div className="flex flex-col justify-center items-center h-80 gap-3">
            <BarLoader color="#709f77" />
            <span className="text-green text-lg font-semibold ml-4 animate-pulse">
              Carregando dados do Contribuinte ...
            </span>
          </div>
        ) : (
          <Card className="w-full shadow-md">
            <CardHeader className="flex flex-row flex-wrap justify-between items-center gap-4">
              <div className="flex-1 min-w-0">
                {consulta.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="text-sm place-content-center tracking-wide">
                      {formataCNPJ(consulta[0]?.ni_prestador || formData.ni)}
                    </Badge>
                    <Separator
                      className="h-5 w-0.5 bg-green"
                      orientation="vertical"
                    />
                    <div className="flex flex-wrap gap-2">
                      {consulta.length > 0
                        ? Array.from(
                          new Set(consulta.map((item) => String(item.ano)))
                        ).map((ano) => <Badge key={ano}>{ano}</Badge>)
                        : null}
                    </div>
                  </div>
                ) : isPending ? null : (
                  <div>
                    <span>Pesquisa não retornou resultados.</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span>
                    <span className="text-lg font-mono font-semibold tracking-wide text-gray-500">
                      {consulta.length}
                    </span>{" "}
                    registro(s) encontrado(s).
                  </span>
                </div>
                {consulta.length > 0 && (
                  <div className="flex flex-row gap-3">
                    <CSVDownloader
                      type={Type.Button}
                      data={consulta}
                      filename={setFileName(
                        formData?.ni ?? "",
                        formData?.anos ?? []
                      )}
                    >
                      <BasicTooltip asChild content="Exportar CSV">
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          className="shadow-sm"
                          onClick={() =>
                            toast.success("CSV exportado com sucesso!")
                          }
                        >
                          <img src={csv_icon} alt="csv" className="w-6 h-6" />
                        </Button>
                      </BasicTooltip>
                    </CSVDownloader>
                    <BasicTooltip asChild content="Exportar XLSX">
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => {
                          exportXLSX(
                            consulta,
                            formData?.ni ?? "",
                            formData?.anos ?? []
                          );
                          toast.success("XLSX exportado com sucesso!");
                        }}
                        className="shadow-sm"
                      >
                        <img src={xlsx_icon} alt="xlsx" className="w-6 h-6" />
                      </Button>
                    </BasicTooltip>
                    <BasicTooltip asChild content="Gerar Relatório PDF">
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={handleGenerateReport}
                        disabled={isGeneratingPdf}
                        className="shadow-sm"
                      >
                        {isGeneratingPdf ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <FileDown className="w-5 h-5 text-red-600" />
                        )}
                      </Button>
                    </BasicTooltip>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-hidden min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 min-w-0 w-full">
                <Input
                  placeholder="Pesquisar em todas as colunas..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full sm:max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Colunas <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {columnDisplayNames[column.id] || column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable table={table} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Consultas;
