import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonTable, SkeletonAvatar } from "@/components/ui/skeleton-loader";

export function DesignSystemSkeleton() {
    return (
        <div className="w-full animate-pulse space-y-8">
            {/* Fake Tabs */}
            <div className="flex gap-2 overflow-hidden mx-auto justify-center mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-24 rounded-full" />
                ))}
            </div>

            <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[auto]">
                {/* Brand Colors - Span 3 */}
                <BentoGridItem
                    className="md:col-span-3 min-h-[300px]"
                    header={<SkeletonCard className="h-full border-0" />}
                    title={<Skeleton className="h-6 w-32 mb-2" />}
                    description={<Skeleton className="h-4 w-64" />}
                    icon={<SkeletonAvatar size={24} />}
                />

                {/* Typography - Span 2 */}
                <BentoGridItem
                    className="md:col-span-2 min-h-[400px]"
                    header={<SkeletonText lines={6} className="pt-4" />}
                    title={<Skeleton className="h-6 w-40 mb-2" />}
                    description={<Skeleton className="h-4 w-48" />}
                    icon={<SkeletonAvatar size={24} />}
                />

                {/* Spacing & Radius - Column 1 Stack */}
                <div className="md:col-span-1 space-y-4">
                    <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-12 rounded" />
                                <Skeleton className="h-8 w-16 rounded" />
                            </div>
                        }
                        title={<Skeleton className="h-6 w-24 mb-2" />}
                        description={<Skeleton className="h-4 w-32" />}
                        icon={<SkeletonAvatar size={24} />}
                    />
                    <BentoGridItem
                        className="h-auto min-h-[180px]"
                        header={
                            <div className="flex gap-4 pt-2 justify-center">
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="h-12 w-12 rounded-xl" />
                            </div>
                        }
                        title={<Skeleton className="h-6 w-24 mb-2" />}
                        description={<Skeleton className="h-4 w-32" />}
                        icon={<SkeletonAvatar size={24} />}
                    />
                </div>

                {/* Shadows - Span 1 */}
                <BentoGridItem
                    className="md:col-span-1"
                    header={<Skeleton className="h-32 w-full rounded-xl" />}
                    title={<Skeleton className="h-6 w-32 mb-2" />}
                    description={<Skeleton className="h-4 w-40" />}
                    icon={<SkeletonAvatar size={24} />}
                />

                {/* Grid - Span 2 */}
                <BentoGridItem
                    className="md:col-span-2"
                    header={<SkeletonTable rows={4} columns={6} className="pt-2" />}
                    title={<Skeleton className="h-6 w-24 mb-2" />}
                    description={<Skeleton className="h-4 w-48" />}
                    icon={<SkeletonAvatar size={24} />}
                />
            </BentoGrid>
        </div>
    );
}
