
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { APIKeys } from "@/components/settings/APIKeys";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { User, Key, Shield, Bell } from "lucide-react";

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
            </Tabs>
        </div>
    );
}
