import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";

export function DesignSystemSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-8">
            {/* Fake Tabs */}
            <div className="flex gap-2 overflow-hidden mx-auto justify-center mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full bg-muted/20" />
                ))}
            </div>

            <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[auto]">
                {/* Brand Colors - Span 3 */}
                <BentoGridItem
                    className="md:col-span-3 min-h-[300px]"
                    header={<Skeleton className="h-full w-full rounded-xl bg-muted/40" />}
                    title={<Skeleton className="h-6 w-32 mb-2 bg-muted/40" />}
                    description={<Skeleton className="h-4 w-64 bg-muted/40" />}
                    icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                />

                {/* Typography - Span 2 */}
                <BentoGridItem
                    className="md:col-span-2 min-h-[400px]"
                    header={
                        <div className="space-y-4 pt-4">
                            <Skeleton className="h-12 w-3/4 rounded-lg bg-muted/40" />
                            <Skeleton className="h-8 w-1/2 rounded-lg bg-muted/40" />
                            <Skeleton className="h-6 w-full rounded-lg bg-muted/40" />
                            <Skeleton className="h-6 w-5/6 rounded-lg bg-muted/40" />
                        </div>
                    }
                    title={<Skeleton className="h-6 w-40 mb-2 bg-muted/40" />}
                    description={<Skeleton className="h-4 w-48 bg-muted/40" />}
                    icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                />

                {/* Spacing & Radius - Column 1 Stack */}
                <div className="md:col-span-1 space-y-4">
                    <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-8 w-8 rounded bg-muted/40" />
                                <Skeleton className="h-8 w-12 rounded bg-muted/40" />
                                <Skeleton className="h-8 w-16 rounded bg-muted/40" />
                            </div>
                        }
                        title={<Skeleton className="h-6 w-24 mb-2 bg-muted/40" />}
                        description={<Skeleton className="h-4 w-32 bg-muted/40" />}
                        icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                    />
                    <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={
                            <div className="flex gap-4 pt-2 justify-center">
                                <Skeleton className="h-12 w-12 rounded-lg bg-muted/40" />
                                <Skeleton className="h-12 w-12 rounded-xl bg-muted/40" />
                            </div>
                        }
                        title={<Skeleton className="h-6 w-24 mb-2 bg-muted/40" />}
                        description={<Skeleton className="h-4 w-32 bg-muted/40" />}
                        icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                    />
                </div>

                {/* Shadows - Span 1 */}
                <BentoGridItem
                    className="md:col-span-1"
                    header={<Skeleton className="h-32 w-full rounded-xl bg-muted/40" />}
                    title={<Skeleton className="h-6 w-32 mb-2 bg-muted/40" />}
                    description={<Skeleton className="h-4 w-40 bg-muted/40" />}
                    icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                />

                {/* Grid - Span 2 */}
                <BentoGridItem
                    className="md:col-span-2"
                    header={
                        <div className="grid grid-cols-12 gap-2 h-32">
                            {[...Array(12)].map((_, i) => (
                                <Skeleton key={i} className="col-span-1 h-full rounded bg-muted/40" />
                            ))}
                        </div>
                    }
                    title={<Skeleton className="h-6 w-24 mb-2 bg-muted/40" />}
                    description={<Skeleton className="h-4 w-48 bg-muted/40" />}
                    icon={<Skeleton className="h-6 w-6 rounded-full bg-muted/40" />}
                />
            </BentoGrid>
        </div>
    );
}
