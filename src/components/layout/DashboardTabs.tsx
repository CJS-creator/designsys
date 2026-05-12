import { TabsContent } from "@/components/ui/tabs";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { DesignToken } from "@/types/tokens";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const FeaturesOverview = lazy(() => import("../FeaturesOverview").then(m => ({ default: m.FeaturesOverview })));
const ColorPaletteDisplay = lazy(() => import("../ColorPaletteDisplay").then(m => ({ default: m.ColorPaletteDisplay })));
const TypographyDisplay = lazy(() => import("../TypographyDisplay").then(m => ({ default: m.TypographyDisplay })));
const SpacingDisplay = lazy(() => import("../SpacingDisplay").then(m => ({ default: m.SpacingDisplay })));
const ShadowDisplay = lazy(() => import("../ShadowDisplay").then(m => ({ default: m.ShadowDisplay })));
const GridDisplay = lazy(() => import("../GridDisplay").then(m => ({ default: m.GridDisplay })));
const BorderRadiusDisplay = lazy(() => import("../BorderRadiusDisplay").then(m => ({ default: m.BorderRadiusDisplay })));
const ComponentLibraryPreview = lazy(() => import("../ComponentLibraryPreview").then(m => ({ default: m.ComponentLibraryPreview })));
const AnimationDisplay = lazy(() => import("../AnimationDisplay").then(m => ({ default: m.AnimationDisplay })));
const TokenManagementDashboard = lazy(() => import("../tokens/TokenManagementDashboard").then(m => ({ default: m.TokenManagementDashboard })));
const AIAdvisor = lazy(() => import("../AIAdvisor").then(m => ({ default: m.AIAdvisor })));

interface DashboardTabsProps {
    activeTab: string;
    designSystem: GeneratedDesignSystem;
    themedDesignSystem: GeneratedDesignSystem | null;
    tokens: DesignToken[];
    onUpdate: (ds: GeneratedDesignSystem) => void;
}

export function DashboardTabs({
    designSystem,
    themedDesignSystem,
    onUpdate
}: DashboardTabsProps) {
    const renderLoader = () => (
        <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
        </div>
    );

    return (
        <>
            <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <FeaturesOverview designSystem={themedDesignSystem || designSystem} />
                </Suspense>
            </TabsContent>

            <TabsContent value="colors" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <ColorPaletteDisplay
                        colors={(themedDesignSystem || designSystem).colors}
                        darkColors={(themedDesignSystem || designSystem).darkColors}
                    />
                </Suspense>
            </TabsContent>

            <TabsContent value="typography" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <TypographyDisplay typography={(themedDesignSystem || designSystem).typography} />
                </Suspense>
            </TabsContent>

            <TabsContent value="spacing" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <SpacingDisplay spacing={(themedDesignSystem || designSystem).spacing} />
                </Suspense>
            </TabsContent>

            <TabsContent value="shadows" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <ShadowDisplay shadows={(themedDesignSystem || designSystem).shadows} />
                </Suspense>
            </TabsContent>

            <TabsContent value="grid" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <GridDisplay grid={(themedDesignSystem || designSystem).grid} />
                </Suspense>
            </TabsContent>

            <TabsContent value="radius" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <BorderRadiusDisplay borderRadius={(themedDesignSystem || designSystem).borderRadius} />
                </Suspense>
            </TabsContent>

            <TabsContent value="animations" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <AnimationDisplay animations={(themedDesignSystem || designSystem).animations} />
                </Suspense>
            </TabsContent>

            <TabsContent value="components" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <ComponentLibraryPreview designSystem={themedDesignSystem || designSystem} />
                </Suspense>
            </TabsContent>

            <TabsContent value="tokens" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <TokenManagementDashboard
                        designSystem={themedDesignSystem || designSystem}
                        designSystemId={designSystem.id}
                    />
                </Suspense>
            </TabsContent>

            <TabsContent value="advisor" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                <Suspense fallback={renderLoader()}>
                    <AIAdvisor
                        designSystem={themedDesignSystem || designSystem}
                        onUpdate={onUpdate}
                    />
                </Suspense>
            </TabsContent>
        </>
    );
}
