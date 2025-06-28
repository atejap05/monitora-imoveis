import { nfseColumns } from "./components/columns";
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
import { useConsultasState } from "./hooks/useConsultasState";
import { toast } from "sonner";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

const Consultas = () => {
  const { consulta, formData, isPending } = useConsultasState();
  const { CSVDownloader, Type } = useCSVDownloader();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: consulta,
    columns: nfseColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Consulta Contribuinte
      </h1>
      <main className="flex-1 flex justify-center items-center">
        {isPending ? (
          <div className="flex flex-col justify-center items-center h-80 gap-3">
            <BarLoader color="#709f77" />
            <span className="text-green text-lg font-semibold ml-4 animate-pulse">
              Carregando dados do Contribuinte ...
            </span>
          </div>
        ) : (
          <Card className="w-full max-w-7xl shadow-md">
            <CardHeader className="flex flex-row justify-between items-center ">
              <div>
                {consulta.length > 0 ? (
                  <div className="flex justify-start gap-2">
                    <Badge className="text-sm place-content-center tracking-wide">
                      {formataCNPJ(consulta[0]?.ni_prestador || formData.ni)}
                    </Badge>
                    <span>
                      <Separator
                        className="h-full w-0.5 bg-green"
                        orientation="vertical"
                      />
                    </span>
                    <div className="flex flex-row gap-2">
                      {consulta.length > 0
                        ? Array.from(
                          new Set(consulta.map(item => String(item.ano)))
                        ).map(ano => <Badge key={ano}>{ano}</Badge>)
                        : null}
                    </div>
                  </div>
                ) : isPending ? null : (
                  <div>
                    <span>Pesquisa não retornou resultados.</span>
                  </div>
                )}
              </div>
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
                  <span className="text-sm text-gray-500">
                    <CSVDownloader
                      type={Type.Button}
                      data={consulta}
                      filename={setFileName(
                        formData?.ni ?? "",
                        formData?.anos ?? []
                      )}
                    >
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className="shadow-sm"
                        onClick={() =>
                          toast.success("CSV exportado com sucesso!")
                        }
                      >
                        <BasicTooltip
                          asChild
                          content="Exportar CSV"
                          label={
                            <img src={csv_icon} alt="csv" className="w-6 h-6" />
                          }
                        />
                      </Button>
                    </CSVDownloader>
                  </span>
                  <span>
                    <BasicTooltip
                      asChild
                      content="Exportar XLSX"
                      label={
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
                      }
                    />
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Pesquisar em todas as colunas..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Colunas <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
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
      </main>
    </div>
  );
};

export default Consultas;
