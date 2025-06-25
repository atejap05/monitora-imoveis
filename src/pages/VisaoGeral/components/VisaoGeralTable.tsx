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
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon, BarChart3 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { MetricasEstatisticas } from "./VisaoGeralColumns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisaoGeralHistogram } from "./VisaoGeralHistogram";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  Loader?: () => React.ReactNode;
  estatisticas?: MetricasEstatisticas;
  metodoCalculo?: string;
}

// Funções utilitárias para formatação
const formatCurrency = (n: number) =>
  `R$ ${n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function VisaoGeralTable<TData>({
  columns,
  data,
  title,
  subtitle,
  isLoading,
  Loader,
  estatisticas,
  metodoCalculo,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
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

  // Identifica a faixa da moda para destacar a linha
  const modaFaixa = estatisticas?.moda;

  return (
    <Card className="container w-full mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="pb-4">{subtitle}</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"default"} size="sm">
                <BarChart3 />
                Histograma
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-full">
              <DialogHeader>
                <DialogTitle>
                  Histograma da Distribuição de Frequência
                </DialogTitle>
                <span
                  id="histograma-desc"
                  className="text-muted-foreground text-sm"
                >
                  Gráfico de barras mostrando a quantidade de notas fiscais por
                  faixa de valor.
                </span>
              </DialogHeader>
              <VisaoGeralHistogram data={data as any} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Média:{" "}
            {estatisticas?.media !== undefined
              ? formatCurrency(estatisticas.media)
              : "--"}
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Mediana:{" "}
            {estatisticas?.mediana !== undefined
              ? typeof estatisticas.mediana === "number"
                ? formatCurrency(estatisticas.mediana)
                : estatisticas.mediana
              : "--"}
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Moda: {estatisticas?.moda ?? "--"}
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Desvio Padrão:{" "}
            {estatisticas?.desvio_padrao !== undefined
              ? typeof estatisticas.desvio_padrao === "number"
                ? formatCurrency(estatisticas.desvio_padrao)
                : estatisticas.desvio_padrao
              : "--"}
          </Badge>
          {metodoCalculo && (
            <Badge className="px-3 py-2 tracking-wide" variant="secondary">
              {metodoCalculo}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && Loader ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-max whitespace-nowrap">
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          <div className="flex items-center justify-center gap-1">
                            {header.isPlaceholder ? null : (
                              <div
                                className={
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : ""
                                }
                                onClick={header.column.getToggleSortingHandler()}
                                title={
                                  header.column.getCanSort()
                                    ? header.column.getNextSortingOrder() ===
                                      "asc"
                                      ? "Sort ascending"
                                      : header.column.getNextSortingOrder() ===
                                        "desc"
                                      ? "Sort descending"
                                      : "Clear sort"
                                    : undefined
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {{
                                    asc: (
                                      <ArrowUpIcon
                                        size={24}
                                        className="text-green"
                                      />
                                    ),
                                    desc: (
                                      <ArrowDownIcon
                                        size={24}
                                        className="text-green"
                                      />
                                    ),
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => {
                    // Destaca a linha se a faixa for igual à moda
                    const isModa =
                      modaFaixa && (row.original as any)?.faixa === modaFaixa;
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={isModa ? "bg-green-100 font-bold" : ""}
                      >
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className="text-center">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {!isLoading && <Pagination table={table} slice={5} />}
    </Card>
  );
}

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "number";
  }
}
