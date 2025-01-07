import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Pagination = ({ table }: { table: any }) => {
  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex-between">
        <div className="flex-between gap-3">
          <Button
            size={"icon"}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            size={"icon"}
            className="w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            size={"icon"}
            className="w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            size={"icon"}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
          <span className="flex-between gap-1">
            <div>Página</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
        </div>
        <div className="flex-between gap-3">
          <p className="flex-between gap-1">
            <span>Ir para página:</span>
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </p>
          <Select
            defaultValue={table.getState().pagination.pageSize.toString()}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue>
                Mostrar {table.getState().pagination.pageSize}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Mostrar {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        Mostrando {table.getRowModel().rows.length.toLocaleString()} de{" "}
        {table.getRowCount().toLocaleString()} Linhas
      </div>
    </div>
  );
};
