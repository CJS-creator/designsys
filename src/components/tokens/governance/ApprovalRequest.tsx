import { useState } from "react";
import { DesignToken } from "@/types/tokens";
import { useApprovals } from "@/hooks/useApprovals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";

interface ApprovalRequestProps {
    designSystemId: string;
    changedTokens: DesignToken[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ApprovalRequest({
    designSystemId,
    changedTokens,
    open,
    onOpenChange,
    onSuccess
}: ApprovalRequestProps) {
    const [description, setDescription] = useState("");
    const { createRequest, loading } = useApprovals(designSystemId);

    const handleSubmit = async () => {
        if (!description.trim()) return;
        await createRequest(description, changedTokens);
        setDescription("");
        onOpenChange(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Submit Changes for Approval</DialogTitle>
                    <DialogDescription>
                        You are about to submit {changedTokens.length} changes for review.
                        Please provide a description of your changes.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            placeholder="Describe what changed and why..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-24"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Changes Summary</label>
                        <ScrollArea className="h-[200px] border rounded-md p-4 bg-muted/30">
                            <div className="space-y-3">
                                {changedTokens.map(token => (
                                    <div key={token.path} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-[10px]">
                                                {token.type}
                                            </Badge>
                                            <span className="font-medium">{token.name}</span>
                                            <span className="text-muted-foreground font-mono text-xs">{token.path}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Show diff or status */}
                                            {token.publishedValue === undefined ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">New</Badge>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <code className="bg-red-500/10 text-red-500 px-1 rounded line-through opacity-70">
                                                        {typeof token.publishedValue === 'object' ? '...' : String(token.publishedValue)}
                                                    </code>
                                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                    <code className="bg-green-500/10 text-green-500 px-1 rounded font-bold">
                                                        {typeof token.value === 'object' ? '...' : String(token.value)}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!description.trim() || loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
