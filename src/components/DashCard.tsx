import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ReactNode } from "react";

type DashCardProps = {
  title: string;
  value: string;
  description: string;
  isPending?: boolean;
  icon?: ReactNode;
};

const DashCardSkeleton = () => {
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
};

const DashCard = ({
  title,
  value,
  description,
  isPending,
  icon,
}: DashCardProps) => {
  if (isPending) {
    return <DashCardSkeleton />;
  }

  return (
    <Card className="flex flex-col items-start p-4 gap-2 min-w-[180px]">
      <div className="flex items-center gap-2">
        {icon && <span style={{ color: "#709f77" }}>{icon}</span>}
        <span className="text-base font-semibold" style={{ color: "#709f77" }}>
          {title}
        </span>
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {description && (
        <span className="text-xs text-gray-400 mb-1">{description}</span>
      )}
    </Card>
  );
};

export default DashCard;
