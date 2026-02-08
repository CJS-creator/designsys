import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle } from "lucide-react";

export type UserRole = "owner" | "editor" | "viewer";

interface TeamSettingsProps {
    designSystemId: string;
    currentUserRole?: UserRole | null;
}

/**
 * TeamSettings component - Stub implementation
 * 
 * This component requires the following database tables that are not yet created:
 * - user_roles
 * 
 * Once this table is created via migration, this component can be fully implemented.
 */
export const TeamSettings = (_props: TeamSettingsProps) => {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Team Management</h2>
                    <p className="text-xs text-muted-foreground font-medium">
                        Collaborate with your team on this design system
                    </p>
                </div>
            </div>

            <Card className="border-dashed border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Team Settings
                    </CardTitle>
                    <CardDescription>
                        Manage team members and their roles
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-amber-700 dark:text-amber-400">
                                Database Setup Required
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                Team management requires the user_roles table to be created. 
                                Please run the required migrations to enable this feature.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
