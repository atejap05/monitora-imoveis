import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { top100NFSeColumns } from "./Top100NotasFiscaisColumns";
import { TTop100NFSe } from "@/@types";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useCSVDownloader } from "react-papaparse";
import { setFileName, exportXLSX } from "@/lib/utils";
import { toast } from "sonner";
import BasicTooltip from "@/components/BasicTooltip";
import csv_icon from "@/assets/csv.png";
import xlsx_icon from "@/assets/xlsx.png";

// Corrigir o tipo para aceitar array de objetos
export type Top100NotasFiscaisTableProps = {
  data: TTop100NFSe;
};

export const Top100NotasFiscaisTable = ({
  data,
}: Top100NotasFiscaisTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { CSVDownloader, Type } = useCSVDownloader();

  const table = useReactTable({
    data,
    columns: top100NFSeColumns,
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

  const formatExportData = (data: TTop100NFSe) =>
    data.map(item => ({
      ...item,
      valordoservico: item.valordoservico.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      dataemissao: new Date(item.dataemissao).toLocaleDateString("pt-BR"),
      chaveacesso: String(item.chaveacesso),
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Pesquisar..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <CSVDownloader
            type={Type.Button}
            data={data}
            filename={setFileName("top100_nfse", [])}
          >
            <Button
              variant={"outline"}
              size={"icon"}
              className="shadow-sm"
              onClick={() => toast.success("CSV exportado com sucesso!")}
            >
              <BasicTooltip asChild content="Exportar CSV">
                <img src={csv_icon} alt="csv" className="w-6 h-6" />
              </BasicTooltip>
            </Button>
          </CSVDownloader>
          <BasicTooltip asChild content="Exportar XLSX">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                exportXLSX(formatExportData(data), "top100_nfse", []);
                toast.success("XLSX exportado com sucesso!");
              }}
              className="shadow-sm"
            >
              <img src={xlsx_icon} alt="xlsx" className="w-6 h-6" />
            </Button>
          </BasicTooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
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
      </div>
      <DataTable table={table} />
    </div>
  );
};
