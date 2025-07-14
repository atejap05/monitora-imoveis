import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const VisaoGeralAdesaoChartSkeleton = () => {
    return (
        <Card className="col-span-12">
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
                <div className="h-[320px] w-full p-4">
                    <Skeleton className="h-full w-full" />
                </div>
            </CardContent>
        </Card>
    );
}; 