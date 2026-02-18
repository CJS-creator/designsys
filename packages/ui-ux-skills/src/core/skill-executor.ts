import { SkillContext, SkillResult } from '@designsys/ui-ux-core';
import { SkillRegistry } from './skill-registry';
import { SkillStore } from '../state/skill-store';

export class SkillExecutor {
    private registry: SkillRegistry;
    private store: SkillStore;

    constructor(store: SkillStore) {
        this.store = store;
        this.registry = new SkillRegistry(store);
    }

    // Method to access registry for registering skills
    getRegistry(): SkillRegistry {
        return this.registry;
    }

    async execute<TInput, TOutput>(
        skillId: string,
        input: TInput,
        context: Partial<SkillContext> = {}
    ): Promise<SkillResult<TOutput>> {
        const startTime = Date.now();
        const executionId = context.executionId || `exec-${Math.random().toString(36).substr(2, 9)}`;

        const skill = this.registry.get(skillId);

        if (!skill) {
            return this.createErrorResult(skillId, executionId, 'SKILL_NOT_FOUND', `Skill ${skillId} not found`, startTime);
        }

        try {
            // 1. Validate Input
            const validation = skill.validate(input);
            if (!validation.valid) {
                return this.createErrorResult(
                    skillId,
                    executionId,
                    'INVALID_INPUT',
                    `Invalid input: ${validation.errors.join(', ')}`,
                    startTime
                );
            }

            // 2. Execute
            const fullContext: SkillContext = {
                executionId,
                timestamp: new Date(),
                ...context
            };

            // Check Cache
            if (skill.cacheConfig) {
                const cacheKey = this.generateCacheKey(skillId, input);
                const cachedOutput = this.store.getFromCache<TOutput>(cacheKey, skill.cacheConfig.persist);

                if (cachedOutput) {
                    const duration = Date.now() - startTime;
                    const result: SkillResult<TOutput> = {
                        skillId,
                        executionId,
                        status: 'success',
                        output: cachedOutput,
                        duration,
                        timestamp: new Date(),
                        cached: true
                    };
                    this.store.saveExecutionResult(result);
                    return result;
                }
            }

            const output = await skill.execute(input, fullContext) as TOutput;
            const duration = Date.now() - startTime;

            const result: SkillResult<TOutput> = {
                skillId,
                executionId,
                status: 'success',
                output,
                duration,
                timestamp: new Date()
            };

            // Save to Cache
            if (skill.cacheConfig) {
                const cacheKey = this.generateCacheKey(skillId, input);
                this.store.saveToCache(cacheKey, output, skill.cacheConfig.ttlMs, skill.cacheConfig.persist);
            }

            // 3. Store History
            this.store.saveExecutionResult(result);

            return result;

        } catch (error) {
            console.error(`Error executing skill ${skillId}:`, error);
            return this.createErrorResult(
                skillId,
                executionId,
                'EXECUTION_ERROR',
                error instanceof Error ? error.message : 'Unknown error',
                startTime
            );
        }
    }

    async executeParallel<TInput, TOutput>(
        requests: Array<{ skillId: string; input: TInput }>,
        context: Partial<SkillContext> = {}
    ): Promise<Map<string, SkillResult<TOutput>>> {
        const results = new Map<string, SkillResult<TOutput>>();

        const promises = requests.map(async (req) => {
            const result = await this.execute<TInput, TOutput>(req.skillId, req.input, context);
            results.set(req.skillId, result);
        });

        await Promise.all(promises);
        return results;
    }

    private createErrorResult(
        skillId: string,
        executionId: string,
        code: string,
        message: string,
        startTime: number
    ): SkillResult<any> {
        const result: SkillResult<any> = {
            skillId,
            executionId,
            status: 'error',
            error: {
                code,
                message,
                recoverable: false
            },
            duration: Date.now() - startTime,
            timestamp: new Date()
        };
        this.store.saveExecutionResult(result);
        return result;
    }

    private generateCacheKey(skillId: string, input: any): string {
        try {
            return `${skillId}:${JSON.stringify(input)}`;
        } catch (e) {
            return `${skillId}:unserializable-${Math.random()}`;
        }
    }
}
