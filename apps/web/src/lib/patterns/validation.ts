import { Pattern } from "./repository";
import { monitor } from "@/lib/monitoring";

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

export interface ValidationRule {
    id: string;
    name: string;
    validate: (pattern: Pattern) => boolean | string; // Returns true or error message
    level: "error" | "warn";
}

const coreRules: ValidationRule[] = [
    {
        id: "required-metadata",
        name: "Required Metadata",
        level: "error",
        validate: (p) => {
            if (!p.id) return "Missing ID";
            if (!p.name) return "Missing Name";
            if (!p.category) return "Missing Category";
            if (!p.metadata?.version) return "Missing Version";
            return true;
        }
    },
    {
        id: "data-integrity",
        name: "Data Integrity",
        level: "error",
        validate: (p) => {
            if (!p.data || Object.keys(p.data).length === 0) return "Pattern data is empty";
            return true;
        }
    }
];

export function validatePattern(pattern: Pattern): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    coreRules.forEach(rule => {
        try {
            const result = rule.validate(pattern);
            if (result !== true) {
                if (rule.level === "error") errors.push(`[${rule.name}] ${result}`);
                else warnings.push(`[${rule.name}] ${result}`);
            }
        } catch (err: any) {
            monitor.error(`Validation rule ${rule.name} failed`, err);
            errors.push(`Rule ${rule.name} threw exception: ${err.message}`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
