import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { monitor } from "@/lib/monitoring";

interface Props {
    children?: ReactNode;
    variant?: "full" | "component" | "mini";
    onReset?: () => void;
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
        monitor.error("Uncaught application error", error, { errorInfo });
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        } else if (this.props.variant === "full") {
            window.location.reload();
        }
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/app";
    };

    public render() {
        const { variant = "full", children } = this.props;

        if (this.state.hasError) {
            if (variant === "mini") {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={this.handleReset}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        title={this.state.error?.message || "Error loading component"}
                    >
                        <AlertTriangle className="h-4 w-4" />
                    </Button>
                );
            }

            if (variant === "component") {
                return (
                    <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center">
                            <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-foreground">Content failed to load</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {this.state.error?.message || "An unexpected error occurred in this section."}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={this.handleReset}
                            className="h-8 rounded-lg border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <RefreshCcw className="mr-2 h-3 w-3" />
                            Retry Section
                        </Button>
                    </div>
                );
            }

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

        return children;
    }
}

export default ErrorBoundary;
