 * SENTRY INTEGRATION:
 * The service now uses @sentry/react for production monitoring.
 * Ensure VITE_SENTRY_DSN is set in your environment variables.
 */
import * as Sentry from "@sentry/react";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEvent {
    level: LogLevel;
    message: string;
    context?: Record<string, unknown>;
    error?: Error;
    timestamp: string;
    category?: string;
}

interface ErrorReportOptions {
    user?: { id?: string; email?: string };
    tags?: Record<string, string>;
    fingerprint?: string[];
}

class MonitoringService {
    private static instance: MonitoringService;
    private isProduction = import.meta.env.PROD;
    private sentryEnabled = false;
    private breadcrumbs: Array<{ message: string; category: string; timestamp: string }> = [];

    private constructor() {
        // Check for Sentry DSN
        if (import.meta.env.VITE_SENTRY_DSN) {
            this.sentryEnabled = true;
            this.initSentry();
        }
    }

    private initSentry() {
        if (this.sentryEnabled) {
            Sentry.init({
                dsn: import.meta.env.VITE_SENTRY_DSN,
                integrations: [
                    Sentry.browserTracingIntegration(),
                    Sentry.replayIntegration(),
                ],
                // Performance Monitoring
                tracesSampleRate: 1.0,
                // Session Replay
                replaysSessionSampleRate: 0.1,
                replaysOnErrorSampleRate: 1.0,
                environment: import.meta.env.MODE,
            });

            this.info("Sentry monitoring initialized", {
                environment: import.meta.env.MODE
            });
        }
    }

    /**
     * Check if Sentry integration is enabled
     */
    public isSentryEnabled(): boolean {
        return this.sentryEnabled;
    }

    public static getInstance(): MonitoringService {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }

    private log(event: LogEvent) {
        // Store breadcrumb for context
        this.breadcrumbs.push({
            message: event.message,
            category: event.category || event.level,
            timestamp: event.timestamp
        });

        if (this.sentryEnabled) {
            Sentry.addBreadcrumb({
                message: event.message,
                category: event.category || event.level,
                level: event.level as Sentry.SeverityLevel,
                data: event.context
            });
        }

        // Keep only last 50 breadcrumbs
        if (this.breadcrumbs.length > 50) {
            this.breadcrumbs.shift();
        }

        // Only log to console in development, or for errors/warnings in production
        if (!this.isProduction) {
            const consoleFn = {
                debug: console.debug,
                info: console.info,
                warn: console.warn,
                error: console.error,
            }[event.level];

            consoleFn(
                `[${event.level.toUpperCase()}] ${event.timestamp}: ${event.message}`,
                event.context || "",
                event.error || ""
            );
        } else if (event.level === "error" || event.level === "warn") {
            // In production, only log errors and warnings (no verbose info/debug)
            const consoleFn = event.level === "error" ? console.error : console.warn;
            consoleFn(`[${event.level.toUpperCase()}] ${event.message}`);
        }

        // Sentry capture for errors
        if (this.sentryEnabled && event.level === "error" && event.error) {
            Sentry.captureException(event.error, { extra: event.context });
        }
    }


    public debug(message: string, context?: Record<string, unknown>) {
        this.log({ level: "debug", message, context, timestamp: new Date().toISOString() });
    }

    public info(message: string, context?: Record<string, unknown>) {
        this.log({ level: "info", message, context, timestamp: new Date().toISOString() });
    }

    public warn(message: string, context?: Record<string, unknown>) {
        this.log({ level: "warn", message, context, timestamp: new Date().toISOString() });
    }

    public error(message: string, error?: Error, context?: Record<string, unknown>) {
        this.log({
            level: "error",
            message,
            error,
            context,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Report a critical error with enhanced context
     */
    public reportError(error: Error, options?: ErrorReportOptions) {
        const context = {
            breadcrumbs: this.breadcrumbs.slice(-10),
            ...options?.tags,
        };

        this.error(error.message, error, context);

        if (this.sentryEnabled) {
            Sentry.captureException(error, {
                user: options?.user as Sentry.User,
                tags: options?.tags,
                fingerprint: options?.fingerprint
            });
        }
    }

    /**
     * Track a custom event (e.g., analytics)
     */
    public trackEvent(eventName: string, properties?: Record<string, unknown>) {
        this.info(`[Event] ${eventName}`, properties);

        // Push to analytics if needed
        const win = window as unknown as { gtag?: (...args: unknown[]) => void };
        if (typeof window !== "undefined" && win.gtag) {
            win.gtag("event", eventName, properties);
        }
    }

    /**
     * Get recent breadcrumbs for debugging
     */
    public getBreadcrumbs() {
        return [...this.breadcrumbs];
    }

    // ============================================
    // PERFORMANCE TIMING
    // ============================================
    private timers: Map<string, number> = new Map();

    /**
     * Start a performance timer
     */
    public startTimer(label: string): void {
        this.timers.set(label, performance.now());
    }

    /**
     * End a timer and log the duration
     */
    public endTimer(label: string): number {
        const start = this.timers.get(label);
        if (!start) {
            this.warn(`Timer "${label}" was never started`);
            return 0;
        }
        const duration = performance.now() - start;
        this.timers.delete(label);
        this.info(`[Perf] ${label}`, { durationMs: Math.round(duration * 100) / 100 });
        return duration;
    }

    /**
     * Wrap an async function with timing
     */
    public async wrapWithTiming<T>(label: string, fn: () => Promise<T>): Promise<T> {
        this.startTimer(label);
        try {
            const result = await fn();
            this.endTimer(label);
            return result;
        } catch (error) {
            this.endTimer(label);
            throw error;
        }
    }
}

export const monitor = MonitoringService.getInstance();
