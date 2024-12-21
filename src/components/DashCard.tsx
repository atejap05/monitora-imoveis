import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

type DashCardProps = {
  title: string;
  value: string;
  description: string;
  isPending?: boolean;
};

const DashCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-4 w-full" />
        </CardTitle>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-2 w-32" />
      </CardContent>
    </Card>
  );
};

const DashCard = ({ title, value, description, isPending }: DashCardProps) => {
  if (isPending) {
    return <DashCardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-2xl font-bold">{value}</p>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashCard;
