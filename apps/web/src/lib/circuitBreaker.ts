
export enum CircuitState {
    CLOSED,
    OPEN,
    HALF_OPEN
}

interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number;
}

export class CircuitBreaker {
    private state = CircuitState.CLOSED;
    private failureCount = 0;
    private nextAttempt = Date.now();
    private failureThreshold: number;
    private resetTimeout: number;

    constructor(options: CircuitBreakerOptions = { failureThreshold: 3, resetTimeout: 5000 }) {
        this.failureThreshold = options.failureThreshold;
        this.resetTimeout = options.resetTimeout;
    }

    public async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() > this.nextAttempt) {
                this.state = CircuitState.HALF_OPEN;
            } else {
                throw new Error("Circuit is OPEN");
            }
        }

        try {
            const result = await fn();
            this.success();
            return result;
        } catch (error) {
            this.failure();
            throw error;
        }
    }

    private success() {
        this.failureCount = 0;
        this.state = CircuitState.CLOSED;
    }

    private failure() {
        this.failureCount++;
        if (this.failureCount >= this.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.resetTimeout;
        }
    }
}

export const aiCircuitBreaker = new CircuitBreaker({
    failureThreshold: 3,
    resetTimeout: 30000 // 30 seconds
});
