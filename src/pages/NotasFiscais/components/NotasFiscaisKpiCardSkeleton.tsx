import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NotasFiscaisKpiCardSkeleton() {
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
