import { Card } from "@/components/ui/card";
import { Sparkline } from "./Sparkline";
import { type EtlData } from "@/lib/utils";
import { ReactNode } from "react";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EtlKpiCardProps {
  title: string;
  value: number | string;
  sparkData: EtlData[];
  description?: string;
  icon?: ReactNode;
}

export function EtlKpiCard({
  title,
  value,
  sparkData,
  description,
  icon,
}: EtlKpiCardProps) {
  return (
    <Card className="flex flex-col items-start p-4 gap-2 min-w-[180px]">
      <div className="flex items-center gap-2">
        {icon && <span style={{ color: "#709f77" }}>{icon}</span>}
        <span className="text-base font-semibold" style={{ color: "#709f77" }}>
          {title}
        </span>
      </div>
      <span className="text-2xl font-bold text-gray-900">
        {formatNumber(value)}
      </span>
      {description && (
        <span className="text-xs text-gray-400 mb-1">{description}</span>
      )}
      <div className="w-full h-8">
        <Sparkline data={sparkData} color="#709f77" />
      </div>
    </Card>
  );
}

export function EtlKpiCardSkeleton() {
  return (
    <Card className="flex flex-col items-start p-4 gap-2 min-w-[180px]">
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="h-4 w-24" />
      </div>
      <span className="text-2xl font-bold text-gray-900">
        <Skeleton className="h-6 w-24" />
      </span>
      <div className="w-full h-8">
        <Skeleton className="h-2 w-32" />
      </div>
    </Card>
  );
}
