import { Skeleton, SkeletonList } from "@/components/ui/skeleton-loader";

export function TokenListSkeleton() {
    return (
        <div className="flex flex-col h-full bg-card/50 rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>
            <div className="p-4 flex-1">
                <SkeletonList items={6} />
            </div>
        </div>
    );
}
