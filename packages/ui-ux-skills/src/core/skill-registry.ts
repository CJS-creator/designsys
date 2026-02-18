import { Skill } from '@designsys/ui-ux-core';
import { SkillStore } from '../state/skill-store';

export class SkillRegistry {
    private skills: Map<string, Skill> = new Map();
    private _store: SkillStore;

    constructor(store: SkillStore) {
        this._store = store;
    }

    register(skill: Skill): void {
        if (this.skills.has(skill.id)) {
            console.warn(`Skill ${skill.id} is already registered. Overwriting.`);
        }
        this.skills.set(skill.id, skill);
    }

    unregister(skillId: string): void {
        this.skills.delete(skillId);
    }

    get(skillId: string): Skill | undefined {
        return this.skills.get(skillId);
    }

    getAll(): Skill[] {
        return Array.from(this.skills.values());
    }

    getByCategory(category: string): Skill[] {
        return this.getAll().filter(s => s.category === category);
    }

    resolveDependencies(skillId: string): Skill[] {
        const skill = this.get(skillId);
        if (!skill) return [];

        const dependencies: Skill[] = [];

        for (const dep of skill.dependencies) {
            const depSkill = this.get(dep.skillId);
            if (depSkill) {
                dependencies.push(depSkill);
                // Recursively resolve
                dependencies.push(...this.resolveDependencies(dep.skillId));
            } else if (!dep.optional) {
                throw new Error(`Missing required dependency: ${dep.skillId}`);
            }
        }

        return dependencies;
    }
}
