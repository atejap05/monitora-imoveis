import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MapSkeleton = () => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
                    <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
                    <div className="text-center space-y-2">
                        <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto animate-spin" />
                        <div className="h-4 w-32 bg-gray-300 rounded mx-auto" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 