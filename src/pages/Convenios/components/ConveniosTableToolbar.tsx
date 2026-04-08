import { Table } from "@tanstack/react-table";
import { MunicipioStatus } from "@/@types";
import { Button, buttonVariants } from "@/components/ui/button";
import BasicTooltip from "@/components/BasicTooltip";
import csv_icon from "@/assets/csv.png";
import xlsx_icon from "@/assets/xlsx.png";
import { useCSVDownloader } from "react-papaparse";
import { toast } from "sonner";
import { exportXLSX, setFileName } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConveniosTableToolbarProps {
  table: Table<MunicipioStatus>;
  getExportData: () => any[];
  hasData: boolean;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function ConveniosTableToolbar({
  table,
  getExportData,
  hasData,
  globalFilter,
  setGlobalFilter,
}: ConveniosTableToolbarProps) {
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 min-w-0">
      <Input
        placeholder="Pesquisar em todas as colunas..."
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        className="w-full sm:max-w-sm min-w-0"
      />
      <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
        {hasData && (
          <>
            <BasicTooltip content="Exportar CSV" asChild>
              <span>
                <CSVDownloader
                  type={Type.Button}
                  data={getExportData()}
                  filename={setFileName("convenios", [])}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className: "shadow-sm",
                  })}
                >
                  <img src={csv_icon} alt="csv" className="w-6 h-6" />
                </CSVDownloader>
              </span>
            </BasicTooltip>
            <BasicTooltip content="Exportar XLSX" asChild>
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  exportXLSX(getExportData(), "convenios", []);
                  toast.success("XLSX exportado com sucesso!");
                }}
                className="shadow-sm"
              >
                <img src={xlsx_icon} alt="xlsx" className="w-6 h-6" />
              </Button>
            </BasicTooltip>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
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
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
