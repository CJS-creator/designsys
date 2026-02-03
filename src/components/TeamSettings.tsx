import { useState, useEffect } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Shield,
    ShieldAlert,
    ShieldCheck,
    Users,
    Lock,
    Unlock,
    Settings2,
    Mail,
    UserPlus,
    Trash2,
    MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export type UserRole = "owner" | "editor" | "viewer";

interface TeamMember {
    id: string;
    user_id: string;
    role: UserRole;
    email?: string;
}

interface TeamSettingsProps {
    designSystemId: string;
}

export const TeamSettings = ({ designSystemId }: TeamSettingsProps) => {
    const [isLocked, setIsLocked] = useState(false);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");

    const fetchMembers = async () => {
        if (!designSystemId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("user_roles" as any)
                .select("*")
                .eq("design_system_id", designSystemId);

            if (error) throw error;
            setMembers((data as any) || []);
        } catch (error) {
            monitor.error("Error fetching members", error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;
        toast.info(`Invitation sent to ${inviteEmail} (Simulation)`);
        setInviteEmail("");
    };

    const updateMemberRole = async (userId: string, newRole: UserRole) => {
        try {
            const { error } = await supabase
                .from("user_roles" as any)
                .update({ role: newRole })
                .eq("user_id", userId)
                .eq("design_system_id", designSystemId);

            if (error) throw error;
            toast.success("Role updated successfully");
            fetchMembers();
        } catch (error: any) {
            toast.error("Failed to update role: " + error.message);
        }
    };

    const removeMember = async (userId: string) => {
        try {
            const { error } = await supabase
                .from("user_roles" as any)
                .delete()
                .eq("user_id", userId)
                .eq("design_system_id", designSystemId);

            if (error) throw error;
            toast.success("Member removed");
            fetchMembers();
        } catch (error: any) {
            toast.error("Failed to remove member: " + error.message);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [designSystemId]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Team Management</h2>
                        <p className="text-xs text-muted-foreground font-medium">Collaborate with your team on this design system</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Active Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-8 text-muted-foreground">Loading members...</div>
                                ) : members.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground italic">Only you are currently in this workspace.</div>
                                ) : (
                                    members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                                                    {member.user_id.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{member.email || "Member"}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">{member.role}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => updateMemberRole(member.user_id, 'editor')}>promote to Editor</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateMemberRole(member.user_id, 'viewer')}>Demote to Viewer</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => removeMember(member.user_id)}>Remove Member</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Invite New Member
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="email@example.com"
                                        className="pl-9"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleInvite} className="gap-2">
                                    Invite
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-orange-500/5 border-orange-500/10">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="h-5 w-5 text-orange-500 mt-0.5" />
                                <div className="space-y-1">
                                    <h5 className="font-semibold text-sm">Role Definitions</h5>
                                    <div className="space-y-2 pt-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-orange-600">Owner</p>
                                            <p className="text-[10px] text-muted-foreground">Full access including team management.</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-orange-600">Editor</p>
                                            <p className="text-[10px] text-muted-foreground">Can edit tokens & pages, but no admin rights.</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase text-orange-600">Viewer</p>
                                            <p className="text-[10px] text-muted-foreground">Read-only access and exports only.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                            <Lock className="h-8 w-8 text-primary opacity-30" />
                            <h4 className="text-sm font-bold">Project Governance</h4>
                            <p className="text-[10px] text-muted-foreground">
                                Lock the project to prevent accidental changes during deployment.
                            </p>
                            <Button
                                variant={isLocked ? "destructive" : "outline"}
                                size="sm"
                                className="w-full h-8 text-[10px]"
                                onClick={() => setIsLocked(!isLocked)}
                            >
                                {isLocked ? "Unfreeze Project" : "Freeze Project"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
