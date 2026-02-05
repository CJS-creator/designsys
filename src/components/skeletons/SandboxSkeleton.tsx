import { Skeleton } from "@/components/ui/skeleton-loader";

export function SandboxSkeleton() {
    return (
        <div className="flex flex-col h-full bg-muted/20 rounded-xl border border-border/50 overflow-hidden">
            {/* Top Bar */}
            <div className="p-4 border-b bg-background/50 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
                {/* Preview Area */}
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
}
