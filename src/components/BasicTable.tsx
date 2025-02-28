import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BasicTableProps = {
  data: Array<Record<string, string | number>>;
  description?: string;
  columns: Columns;
  className?: string;
  title?: string;
  subtitle?: string;
};
type Columns = {
  header: string;
  key: string;
  align?: "left" | "center" | "right";
  format?: (value: string | number) => string;
  className?: string;
}[];

export const BasicTable = ({
  data,
  description,
  columns,
  className,
  title,
  subtitle,
}: BasicTableProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Table className="w-full rounded-md">
          <TableCaption>{description}</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {columns.map((column, index) => (
                <TableHead className="text-center" key={index}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={columnIndex}
                    className={`text-center ${column.className || ""}`}
                    style={{ textAlign: column.align }}
                  >
                    {column.format
                      ? column.format(row[column.key] as string | number)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
