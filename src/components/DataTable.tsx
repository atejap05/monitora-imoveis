import {
  RowData,
  flexRender,
  Table as TanstackTable,
} from "@tanstack/react-table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/Pagination";

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
}

export function DataTable<TData>({
  table,
}: DataTableProps<TData>) {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full table-auto caption-bottom text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center justify-center gap-1"
                                : "flex items-center justify-center gap-1"
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === "asc"
                                  ? "Ordenar ascendente"
                                  : header.column.getNextSortingOrder() === "desc"
                                    ? "Ordenar descendente"
                                    : "Limpar ordenação"
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <ArrowUpIcon size={16} className="text-green" />,
                              desc: <ArrowDownIcon size={16} className="text-green" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <Separator className="mb-4" />
        <Pagination slice={10} table={table} />
      </div>
    </div>
  );
}

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "number";
  }
}
