import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface PresenceUser {
    user_id: string;
    email: string;
    online_at: string;
}

export function usePresence(designSystemId: string, onUpdate?: (data: any) => void) {
    const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
    const { user } = useAuth();
    const channelRef = useRef<RealtimeChannel | null>(null);
    const onUpdateRef = useRef(onUpdate);

    // Keep onUpdateRef in sync without triggering effects
    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
        if (!designSystemId || !user) return;

        const channel = supabase.channel(`presence-ds-${designSystemId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channelRef.current = channel;

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();
                const users: PresenceUser[] = [];

                Object.keys(state).forEach((key) => {
                    const presence = state[key];
                    if (presence && presence.length > 0) {
                        const userPresence = presence[0] as any;
                        users.push({
                            user_id: key,
                            email: userPresence.email || "Unknown User",
                            online_at: userPresence.online_at,
                        });
                    }
                });

                setOnlineUsers(users);
            })
            .on("broadcast", { event: "token-update" }, (payload) => {
                if (onUpdateRef.current && payload.payload.user_id !== user.id) {
                    onUpdateRef.current(payload.payload.designSystem);
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
            channelRef.current = null;
        };
    }, [designSystemId, user?.id]); // Only resync if designSystemId or user changes

    const broadcastUpdate = useCallback((designSystem: any) => {
        if (channelRef.current && user) {
            channelRef.current.send({
                type: "broadcast",
                event: "token-update",
                payload: {
                    user_id: user.id,
                    designSystem
                }
            });
        }
    }, [user?.id]);

    return { onlineUsers, broadcastUpdate };
}
