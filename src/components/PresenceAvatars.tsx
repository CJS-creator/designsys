import { PresenceUser } from "@/hooks/usePresence";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

export function PresenceAvatars({ users }: { users: PresenceUser[] }) {
    if (users.length === 0) return null;

    return (
        <TooltipProvider>
            <div className="flex -space-x-2 overflow-hidden items-center">
                {users.map((user) => (
                    <Tooltip key={user.user_id}>
                        <TooltipTrigger asChild>
                            <div
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-primary/20 flex items-center justify-center text-[10px] font-bold cursor-default hover:z-10 transition-transform hover:scale-110"
                                style={{ backgroundColor: `hsla(${parseInt(user.user_id.slice(0, 8), 16) % 360}, 70%, 80%, 1)` }}
                            >
                                {user.email.slice(0, 2).toUpperCase()}
                                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-background" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-[10px] font-bold">{user.email}</p>
                            <p className="text-[8px] text-muted-foreground">Active now</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                {users.length > 3 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                        +{users.length - 3}
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
}
