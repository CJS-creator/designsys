
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { APIKeys } from "@/components/settings/APIKeys";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { User, Key, Shield, Bell, Cpu } from "lucide-react";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
    return (
        <div className="container py-6 space-y-6">
            <AppBreadcrumb activeTab="settings" />

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and API preferences.
                </p>
            </div>

            <Tabs defaultValue="api" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
                    <TabsTrigger value="profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="api">
                        <Key className="h-4 w-4 mr-2" />
                        API Keys
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="features">
                        <Cpu className="h-4 w-4 mr-2" />
                        Feature Flags
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="profile" className="space-y-6">
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <h3 className="font-medium">Profile Settings</h3>
                        <p className="text-sm text-muted-foreground">Profile management coming soon.</p>
                    </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-6">
                    <APIKeys />
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <h3 className="font-medium">Security Settings</h3>
                        <p className="text-sm text-muted-foreground">Security settings coming soon.</p>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <h3 className="font-medium">Notifications</h3>
                        <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
                    </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-6">
                    <FeatureFlagsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function FeatureFlagsTab() {
    const { flags, toggleFlag } = useFeatureFlags();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Skill Engine Rollout</CardTitle>
                    <CardDescription>
                        Toggle new modular skill-based generation systems. These use the `@designsys/ui-ux-skills` package.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="skill-engine" className="flex flex-col space-y-1">
                            <span>Use Skill Engine</span>
                            <span className="font-normal text-muted-foreground">
                                Enables async pattern-based generation for color and typography.
                            </span>
                        </Label>
                        <Switch
                            id="skill-engine"
                            checked={flags.useSkillEngine}
                            onCheckedChange={() => toggleFlag('useSkillEngine')}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="bm25-search" className="flex flex-col space-y-1">
                            <span>BM25 Pattern Search</span>
                            <span className="font-normal text-muted-foreground">
                                Use advanced BM25 ranking for matching UI/UX patterns.
                            </span>
                        </Label>
                        <Switch
                            id="bm25-search"
                            checked={flags.useBM25Search}
                            onCheckedChange={() => toggleFlag('useBM25Search')}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
                <p className="font-bold mb-1">Warning: Experimental Features</p>
                <p>Enabling these flags may cause unexpected UI behavior or slower generation times while in beta.</p>
            </div>
        </div>
    );
}

