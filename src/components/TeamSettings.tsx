import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Users,
    UserPlus,
    Shield,
    ShieldCheck,
    ShieldAlert,
    MoreVertical,
    Trash2,
    Check
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useTeam } from "@/hooks/useTeam";
import { formatDistanceToNow } from "date-fns";

export type UserRole = "owner" | "editor" | "viewer";

interface TeamSettingsProps {
    designSystemId: string;
    currentUserRole?: UserRole | null;
}

export const TeamSettings = ({ designSystemId, currentUserRole }: TeamSettingsProps) => {
    const { members, loading, updateMemberRole, removeMember } = useTeam(designSystemId);
    const [isInviting, setIsInviting] = useState(false);

    const isOwner = currentUserRole === "owner";

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case "owner":
                return <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20"><ShieldCheck className="h-3 w-3" /> Owner</Badge>;
            case "editor":
                return <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20"><Shield className="h-3 w-3" /> Editor</Badge>;
            case "viewer":
                return <Badge variant="secondary" className="gap-1 bg-slate-500/10 text-slate-600 border-slate-500/20"><ShieldAlert className="h-3 w-3" /> Viewer</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Synchronizing team data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Team Management</h2>
                        <p className="text-xs text-muted-foreground font-medium">
                            {members.length} {members.length === 1 ? 'member' : 'members'} collaborating on this system
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <Button onClick={() => setIsInviting(true)} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Invite Member
                    </Button>
                )}
            </div>

            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Workspace Members</CardTitle>
                    <CardDescription>
                        Manage access levels and permissions for your team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-border/40">
                        {members.map((member) => (
                            <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-background group-hover:border-primary/20 transition-colors">
                                        <AvatarImage src={member.profile?.avatar_url || ""} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                            {member.profile?.full_name?.[0] || member.profile?.username?.[0] || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">
                                                {member.profile?.full_name || member.profile?.username || 'Unknown User'}
                                            </span>
                                            {getRoleBadge(member.role)}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                            Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>

                                {isOwner && member.role !== 'owner' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Change Role</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, 'editor')} className="gap-2">
                                                <Shield className="h-3 w-3 text-blue-500" />
                                                <span>Editor</span>
                                                {member.role === 'editor' && <Check className="h-3 w-3 ml-auto text-primary" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateMemberRole(member.id, 'viewer')} className="gap-2">
                                                <ShieldAlert className="h-3 w-3 text-slate-500" />
                                                <span>Viewer</span>
                                                {member.role === 'viewer' && <Check className="h-3 w-3 ml-auto text-primary" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => removeMember(member.id)}
                                                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span>Remove from team</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Invite Dialog placeholder - would be a real implementation with search */}
            {isInviting && (
                <Card className="border-primary p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Invite to Design System</h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsInviting(false)}>Cancel</Button>
                        </div>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">
                                In a production environment, you would search for users by name or email here.
                            </p>
                            <Button className="w-full" disabled>Send Invitation (Coming Soon)</Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
