import { useState } from "react";
import {
  ColumnDef,
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
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  return (
    <div className="w-full overflow-x-auto transition-all duration-300">
      <div className="flex items-center justify-between mb-2 gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Colunas <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {table.getAllLeafColumns().map(column => {
                const headerObj = table
                  .getHeaderGroups()
                  .flatMap(group => group.headers)
                  .find(h => h.column.id === column.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                    className="h-7 flex justify-between items-center text-primary"
                  >
                    {column.columnDef.header &&
                    typeof column.columnDef.header === "function"
                      ? headerObj
                        ? column.columnDef.header(headerObj.getContext())
                        : column.id
                      : String(column.columnDef.header)}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Input
          placeholder="Pesquisar em todas as colunas..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-80 border shadow rounded"
        />
      </div>
      <Table className="min-w-[900px] w-full">
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
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
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
                                <ArrowUpIcon size={24} className="text-green" />
                              ),
                              desc: (
                                <ArrowDownIcon
                                  size={24}
                                  className="text-green"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
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
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="text-center align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      <Pagination slice={10} table={table} />
      <Separator />
    </div>
  );
}

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "number";
  }
}
