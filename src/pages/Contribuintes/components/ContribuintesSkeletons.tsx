import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ContribuintesKpiSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export const ContribuintesChartSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
            <div className="h-[300px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                    <div className="flex items-end gap-2 justify-center">
                        <Skeleton className="w-8 h-16" />
                        <Skeleton className="w-8 h-20" />
                        <Skeleton className="w-8 h-24" />
                        <Skeleton className="w-8 h-28" />
                        <Skeleton className="w-8 h-32" />
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="h-3 w-12" />
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const ContribuintesPieChartSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
            <div className="h-[400px] flex items-center justify-center">
                <div className="space-y-4">
                    <Skeleton className="h-48 w-48 rounded-full mx-auto" />
                    <div className="flex justify-center gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const ContribuintesTableSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <CardHeader>
            <CardTitle>
                <Skeleton className="h-6 w-64" />
            </CardTitle>
            <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {/* Table header */}
                <div className="grid grid-cols-4 gap-4 border-b pb-2">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-4 w-full" />
                    ))}
                </div>
                {/* Table rows */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="grid grid-cols-4 gap-4 py-2">
                        {[1, 2, 3, 4].map(j => (
                            <Skeleton key={j} className="h-4 w-full" />
                        ))}
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export const ContribuintesLineChartSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
            <div className="h-[300px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                    <div className="flex items-end gap-2 justify-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <Skeleton className="h-2 w-2 rounded-full" />
                                <Skeleton className="h-0.5 w-8" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} className="h-3 w-8" />
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export const ContribuintesGroupedBarChartSkeleton: React.FC = () => (
    <Card className="animate-pulse">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-6 w-40" />
            </CardTitle>
            <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
            <div className="h-[300px] flex items-center justify-center">
                <div className="space-y-3 w-full">
                    <div className="flex items-end gap-4 justify-center">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-1">
                                <Skeleton className="w-6 h-20" />
                                <Skeleton className="w-6 h-16" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-3 w-16" />
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
); 