import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Shield, ShieldAlert, ShieldCheck, Users, Lock, Unlock, Settings2 } from "lucide-react";
import { toast } from "sonner";

export type UserRole = "admin" | "editor" | "viewer";

interface TeamSettingsProps {
    currentRole: UserRole;
    onRoleChange: (role: UserRole) => void;
}

export const TeamSettings = ({ currentRole, onRoleChange }: TeamSettingsProps) => {
    const [isLocked, setIsLocked] = useState(false);

    const handleRoleUpdate = (role: string) => {
        onRoleChange(role as UserRole);
        toast.success(`Role updated to ${role.charAt(0).toUpperCase() + role.slice(1)}`);
    };

    const toggleProjectLock = () => {
        setIsLocked(!isLocked);
        toast.info(isLocked ? "Project unlocked for editing" : "Project locked for all members");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Shield className="h-6 w-6 text-primary" />
                                Access & Permissions
                            </CardTitle>
                            <CardDescription>
                                Configure roles and project-level governance rules.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Manage My Role</h3>
                        </div>

                        <RadioGroup
                            value={currentRole}
                            onValueChange={handleRoleUpdate}
                            className="grid gap-4"
                        >
                            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleRoleUpdate("admin")}>
                                <RadioGroupItem value="admin" id="admin" className="mt-1" />
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="admin" className="font-bold flex items-center gap-2 cursor-pointer">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        Administrator
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Full control over tokens, governance, and integrations.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleRoleUpdate("editor")}>
                                <RadioGroupItem value="editor" id="editor" className="mt-1" />
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="editor" className="font-bold cursor-pointer">Editor</Label>
                                    <p className="text-xs text-muted-foreground">Can edit tokens and save versions, but cannot manage team.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleRoleUpdate("viewer")}>
                                <RadioGroupItem value="viewer" id="viewer" className="mt-1" />
                                <div className="grid gap-1.5 flex-1">
                                    <Label htmlFor="viewer" className="font-bold cursor-pointer">Viewer (Read-Only)</Label>
                                    <p className="text-xs text-muted-foreground">Historical access and code exports only. Cannot modify tokens.</p>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="pt-6 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-orange-500" />
                                    Project Freeze
                                </h4>
                                <p className="text-xs text-muted-foreground">Prevent any changes to the current design system draft.</p>
                            </div>
                            <Button
                                variant={isLocked ? "destructive" : "outline"}
                                size="sm"
                                onClick={toggleProjectLock}
                                className="gap-2"
                            >
                                {isLocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                {isLocked ? "Unfreeze" : "Freeze Project"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-orange-500/5 border-orange-500/10">
                    <CardContent className="pt-6 space-y-2 flex items-start gap-4">
                        <ShieldAlert className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                            <h5 className="font-semibold text-sm">Enterprise Governance</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                RBAC roles are currently simulated for the workspace session. Permanent cloud-synced roles require an Enterprise subscription.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 space-y-2 flex items-start gap-4">
                        <Settings2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                            <h5 className="font-semibold text-sm">Policy Enforcement</h5>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                "Viewer" roles will automatically see "Save" and "Generate" actions disabled throughout the platform.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
