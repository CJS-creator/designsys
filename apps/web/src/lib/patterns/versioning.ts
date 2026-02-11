/**
 * Semantic Versioning helpers for Design Patterns
 */

export function parseVersion(version: string): { major: number; minor: number; patch: number } | null {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return null;
    return {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
    };
}

export function isCompatible(required: string, actual: string): boolean {
    const req = parseVersion(required);
    const act = parseVersion(actual);

    if (!req || !act) return false;

    // Major version must match
    if (req.major !== act.major) return false;

    // Minor version must be >= required
    if (act.minor < req.minor) return false;

    // If minor is equal, patch must be >= required
    if (act.minor === req.minor && act.patch < req.patch) return false;

    return true;
}

export function bumpVersion(current: string, type: "major" | "minor" | "patch"): string {
    const v = parseVersion(current);
    if (!v) throw new Error(`Invalid version string: ${current}`);

    switch (type) {
        case "major":
            return `${v.major + 1}.0.0`;
        case "minor":
            return `${v.major}.${v.minor + 1}.0`;
        case "patch":
            return `${v.major}.${v.minor}.${v.patch + 1}`;
    }
}
