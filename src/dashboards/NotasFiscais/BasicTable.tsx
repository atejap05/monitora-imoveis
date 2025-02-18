import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

type BasicTableProps = {
  data: Array<{
    year: string;
    app: number;
    web: number;
    webservice: number;
    proprio: number;
  }>;
  description: string;
  headers: Array<string>;
};

export const BasicTable = ({ data, description, headers }: BasicTableProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Table className="w-full rounded-md">
          <TableCaption>{description}</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100">
              {headers.map((header, index) => (
                <TableHead className="text-center" key={index}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="bg-gray-100">{row.year}</TableCell>
                <TableCell>{formatNumber(row.app)}</TableCell>
                <TableCell>{formatNumber(row.web)}</TableCell>
                <TableCell>{formatNumber(row.webservice)}</TableCell>
                <TableCell>{formatNumber(row.proprio)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
