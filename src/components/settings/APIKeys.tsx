import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Key, AlertTriangle } from "lucide-react";

/**
 * APIKeys component - Stub implementation
 * 
 * This component requires the following database tables that are not yet created:
 * - api_keys
 * 
 * Once this table is created via migration, this component can be fully implemented.
 * 
 * For a working API key manager that uses localStorage, see:
 * src/components/ApiKeyManager.tsx
 */
export function APIKeys() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">API Keys</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your API keys for programmatic access to the DesignSys API.
                    </p>
                </div>
            </div>

            <Card className="border-dashed border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" />
                        API Key Management
                    </CardTitle>
                    <CardDescription>
                        Generate and manage API keys for programmatic access
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
                                API key management requires the api_keys table to be created. 
                                Please run the required migrations to enable this feature.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
