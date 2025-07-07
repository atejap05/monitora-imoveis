import { ColumnDef } from "@tanstack/react-table";
import { MunicipioStatus } from "@/@types";
import { Checkbox } from "@/components/ui/checkbox";
import { conveniosColumns } from "./columns";

export function getConveniosColumnsWithSelect(): ColumnDef<MunicipioStatus>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...conveniosColumns,
  ];
}
