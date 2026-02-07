import { useEffect, useState } from "react";
import { monitor } from "@/lib/monitoring";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users } from "lucide-react";

interface PresenceUser {
    user_id: string;
    email: string;
    online_at: string;
}

interface CollaborationOverlayProps {
    channelId: string;
    currentUser: unknown;
}

export const CollaborationOverlay = ({ channelId, currentUser }: CollaborationOverlayProps) => {
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

    useEffect(() => {
        if (!channelId || !currentUser) return;

        const channel = supabase.channel(`design-collaboration-${channelId}`);

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                const users: PresenceUser[] = [];

                Object.values(state).forEach((presences: unknown) => {
                    (presences as unknown[]).forEach((presence: unknown) => {
                        users.push(presence as PresenceUser);
                    });
                });

                // Filter unique users by user_id
                const uniqueUsers = Array.from(new Map(users.map(u => [u.user_id, u])).values());
                setOnlineUsers(uniqueUsers);
            })
            .on("presence", { event: "join" }, ({ newPresences }) => {
                monitor.debug("Users joined collaboration", { newPresences });
            })
            .on("presence", { event: "leave" }, ({ leftPresences }) => {
                monitor.debug("Users left collaboration", { leftPresences });
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    const presenceTrackStatus = await channel.track({
                        user_id: (currentUser as { id: string }).id,
                        email: (currentUser as { email: string }).email,
                        online_at: new Date().toISOString(),
                    });
                    monitor.debug("Presence tracking status", { presenceTrackStatus });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [channelId, currentUser]);

    if (onlineUsers.length <= 1) return null;

    return (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md border rounded-full px-4 py-2 shadow-lg animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex -space-x-3 overflow-hidden">
                <TooltipProvider>
                    {onlineUsers.map((user) => (
                        <Tooltip key={user.user_id}>
                            <TooltipTrigger asChild>
                                <Avatar className="inline-block border-2 border-background h-8 w-8 transition-transform hover:scale-110 cursor-default">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                    <AvatarFallback className="bg-primary/10 text-[10px] font-bold">
                                        {user.email.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">{user.email} {user.user_id === (currentUser as { id?: string })?.id ? "(You)" : ""}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{onlineUsers.length} online</span>
            </div>
        </div>
    );
};
