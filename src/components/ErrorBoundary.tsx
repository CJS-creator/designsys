import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 antialiased">
                    <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-destructive/10 text-destructive shadow-lg shadow-destructive/5 ring-1 ring-destructive/20 scale-110">
                                <AlertTriangle className="h-12 w-12" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Something went wrong</h1>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                An unexpected error occurred. Our team has been notified.
                            </p>
                            {this.state.error && (
                                <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border text-left overflow-hidden">
                                    <p className="text-xs font-mono text-muted-foreground break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                onClick={this.handleReset}
                                className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20"
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={this.handleGoHome}
                                className="flex-1 h-12 rounded-2xl font-bold border-2"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground pt-4">
                            If the problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.children;
    }
}

export default ErrorBoundary;
