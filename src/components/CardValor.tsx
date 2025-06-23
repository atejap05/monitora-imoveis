import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface CardValorProps {
  title: string;
  description: string;
  value: number | string;
}

export const CardValor = ({ title, description, value }: CardValorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-semibold text-gray-800">
          {formatNumber(value)}
        </span>
      </CardContent>
    </Card>
  );
};
