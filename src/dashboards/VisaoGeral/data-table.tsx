import { useEffect, useState } from "react";
import {
  Column,
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
import { ArrowUpIcon, ArrowDownIcon, SearchIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  title?: string;
  subtitle?: string;
}

export function DataTable<TData>({
  columns,
  data,
  title,
  subtitle,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [idsInputFilter, setIdsInputFilter] = useState<Array<string>>([]);

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

  return (
    <Card className="container lg:w-2/3 mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="pb-4">{subtitle}</CardDescription>
        <div className="flex justify-start gap-3">
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Média: 1000
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Mediana: 500
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Moda: 200
          </Badge>
          <Badge className="px-3 py-2 tracking-wide" variant={"outline"}>
            Desvio Padrão: 300
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      <div className="flex items-center justify-start gap-1">
                        {header.column.getCanFilter() && (
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="ml-2 rounded-full"
                            onClick={() => {
                              if (idsInputFilter.includes(header.column.id)) {
                                setIdsInputFilter(
                                  idsInputFilter.filter(
                                    id => id !== header.column.id
                                  )
                                );
                              } else {
                                setIdsInputFilter([
                                  ...idsInputFilter,
                                  header.column.id,
                                ]);
                              }
                            }}
                          >
                            <SearchIcon size={24} className="text-green" />
                          </Button>
                        )}
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
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {idsInputFilter.includes(header.column.id) &&
                        header.column.getCanFilter() ? (
                          <Filter column={header.column} />
                        ) : null}
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
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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

        <Pagination table={table} slice={5} />
      </CardContent>
    </Card>
  );
}

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "number";
  }
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "number" ? (
    <DebouncedInput
      type="number"
      value={(columnFilterValue ?? "") as string}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Pesquisar...`}
      className="w-36 border shadow rounded"
    />
  ) : (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Pesquisar...`}
      className="w-36 border shadow rounded"
    />
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
      className="bg-white py-2"
    />
  );
}
