import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PresenceUser {
    user_id: string;
    email: string;
    online_at: string;
}

export function usePresence(designSystemId: string, onUpdate?: (data: any) => void) {
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!designSystemId || !user) return;

        const channel = supabase.channel(`design-system:${designSystemId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                const users: PresenceUser[] = [];

                Object.keys(state).forEach((key) => {
                    const userPresence = state[key][0] as any;
                    users.push({
                        user_id: key,
                        email: userPresence.email || "Unknown User",
                        online_at: userPresence.online_at,
                    });
                });

                setOnlineUsers(users);
            })
            .on("broadcast", { event: "token-update" }, (payload) => {
                console.log("Token update received:", payload);
                if (onUpdate && payload.payload.user_id !== user.id) {
                    onUpdate(payload.payload.designSystem);
                }
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        email: user.email,
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [designSystemId, user, onUpdate]);

    const broadcastUpdate = (designSystem: any) => {
        const channel = supabase.channel(`design-system:${designSystemId}`);
        channel.send({
            type: "broadcast",
            event: "token-update",
            payload: {
                user_id: user?.id,
                designSystem
            }
        });
    };

    return { onlineUsers, broadcastUpdate };
}
