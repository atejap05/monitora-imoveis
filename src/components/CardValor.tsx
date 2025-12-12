import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface CardValorProps {
  title: React.ReactNode;
  description: string;
  value: number | string;
  icon?: React.ReactNode;
  suffix?: string;
}

export const CardValor = ({
  title,
  description,
  value,
  icon,
  suffix,
}: CardValorProps) => {
  return (
    <Card className="flex flex-col items-start p-4 gap-2 min-w-[180px]">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base font-semibold text-green">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <span className="text-2xl font-bold text-gray-900">
          {formatNumber(value)}
          {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
        </span>
        <CardDescription className="text-xs text-gray-400">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
