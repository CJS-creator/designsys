import React, { createContext, useContext, useEffect, useState } from 'react';
import { SkillStore, SkillExecutor, GeneratePaletteSkill, GenerateTypographySkill, MatchVibeSkill, DetectComplexitySkill } from '@designsys/ui-ux-skills';
import { SkillResult } from '@designsys/ui-ux-core';

interface SkillContextType {
    executor: SkillExecutor | null;
    executeSkill: <TInput, TOutput>(skillId: string, input: TInput) => Promise<SkillResult<TOutput>>;
    isReady: boolean;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [executor, setExecutor] = useState<SkillExecutor | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Initialize the Skill Engine
        const store = new SkillStore();
        const exec = new SkillExecutor(store);
        const registry = exec.getRegistry();

        // Register built-in skills
        // In a real app, this might be dynamic or lazy-loaded
        registry.register(new GeneratePaletteSkill());
        registry.register(new GenerateTypographySkill());
        registry.register(new MatchVibeSkill());
        registry.register(new DetectComplexitySkill());

        setExecutor(exec);
        setIsReady(true);

        console.log('Skill Engine Initialized with skills:', registry.getAll().map(s => s.id));
    }, []);

    const executeSkill = async <TInput, TOutput>(skillId: string, input: TInput): Promise<SkillResult<TOutput>> => {
        if (!executor) {
            throw new Error('Skill Executor not initialized');
        }
        return executor.execute<TInput, TOutput>(skillId, input);
    };

    return (
        <SkillContext.Provider value={{ executor, executeSkill, isReady }}>
            {children}
        </SkillContext.Provider>
    );
};

export const useSkillContext = () => {
    const context = useContext(SkillContext);
    if (context === undefined) {
        throw new Error('useSkillContext must be used within a SkillProvider');
    }
    return context;
};
