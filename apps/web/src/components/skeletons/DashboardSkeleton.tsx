import { Skeleton, SkeletonList } from "@/components/ui/skeleton-loader";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
            <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden p-6 gap-6">
                <div className="w-1/2 flex flex-col gap-6">
                    <SkeletonList items={8} className="bg-card/50 rounded-xl border border-border p-4" />
                </div>
                <div className="w-1/2">
                    <Card className="h-full">
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
