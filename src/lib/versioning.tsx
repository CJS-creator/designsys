/**
 * Component Versioning System
 * 
 * Provides comprehensive versioning for design system components including:
 * - Version tracking
 * - Change history
 * - Diff generation
 * - Rollback support
 */

import * as React from 'react';

// Version types
export interface Version {
  id: string;
  version: string;
  timestamp: Date;
  author: string;
  changes: Change[];
  breaking: boolean;
  message?: string;
}

export interface Change {
  type: 'added' | 'modified' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  affected: string[];
  breaking: boolean;
}

export interface ComponentVersion {
  name: string;
  currentVersion: string;
  versions: Version[];
  deprecated: boolean;
  deprecationMessage?: string;
  replacedBy?: string;
}

// Version comparison
export interface VersionDiff {
  added: Change[];
  modified: Change[];
  removed: Change[];
  breaking: Change[];
}

// Generate semantic version
export function generateVersion(
  currentVersion: string,
  changeType: 'major' | 'minor' | 'patch'
): string {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

// Parse version string
export function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const parts = version.split('.');
  return {
    major: parseInt(parts[0]) || 0,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
  };
}

// Compare versions
export function compareVersions(v1: string, v2: string): number {
  const p1 = parseVersion(v1);
  const p2 = parseVersion(v2);

  if (p1.major !== p2.major) return p1.major - p2.major;
  if (p1.minor !== p2.minor) return p1.minor - p2.minor;
  return p1.patch - p2.patch;
}

// Generate changelog
export function generateChangelog(versions: Version[]): string {
  const lines: string[] = ['# Changelog', ''];

  versions.forEach((version) => {
    lines.push(`## ${version.version}`);
    lines.push('');
    lines.push(`**${new Date(version.timestamp).toLocaleDateString()}** - ${version.author}`);
    lines.push('');

    if (version.message) {
      lines.push(version.message);
      lines.push('');
    }

    const changesByType = groupChangesByType(version.changes);

    Object.entries(changesByType).forEach(([type, changes]) => {
      if (changes.length > 0) {
        const header = type.charAt(0).toUpperCase() + type.slice(1);
        lines.push(`### ${header}`);
        changes.forEach((change) => {
          lines.push(`- ${change.description}`);
          if (change.affected.length > 0) {
            lines.push(`  - Affected: ${change.affected.join(', ')}`);
          }
        });
        lines.push('');
      }
    });

    if (version.breaking) {
      lines.push('⚠️ **This version contains breaking changes**');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  return lines.join('\n');
}

// Group changes by type
function groupChangesByType(changes: Change[]): Record<string, Change[]> {
  return changes.reduce((acc, change) => {
    if (!acc[change.type]) {
      acc[change.type] = [];
    }
    acc[change.type].push(change);
    return acc;
  }, {} as Record<string, Change[]>);
}

// Calculate diff between versions
export function calculateDiff(
  oldVersion: Version,
  newVersion: Version
): VersionDiff {
  const oldChanges = new Set(oldVersion.changes.flatMap((c) => c.affected));
  const newChanges = new Set(newVersion.changes.flatMap((c) => c.affected));

  return {
    added: newVersion.changes.filter(
      (c) => c.type === 'added' || !oldChanges.has(c.affected[0])
    ),
    modified: newVersion.changes.filter(
      (c) => c.type === 'modified' && oldChanges.has(c.affected[0])
    ),
    removed: oldVersion.changes.filter(
      (c) =>
        c.type === 'removed' || !newChanges.has(c.affected[0])
    ),
    breaking: [
      ...oldVersion.changes.filter((c) => c.breaking),
      ...newVersion.changes.filter((c) => c.breaking),
    ],
  };
}

// Version history hook
export function useVersionHistory(componentName: string) {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = React.useState('1.0.0');

  const addVersion = React.useCallback(
    (
      changeType: 'major' | 'minor' | 'patch',
      author: string,
      changes: Change[],
      message?: string
    ) => {
      const newVersion = generateVersion(currentVersion, changeType);
      const version: Version = {
        id: crypto.randomUUID(),
        version: newVersion,
        timestamp: new Date(),
        author,
        changes,
        breaking: changeType === 'major' || changes.some((c) => c.breaking),
        message,
      };

      setVersions((prev) => [version, ...prev]);
      setCurrentVersion(newVersion);
    },
    [currentVersion]
  );

  const rollback = React.useCallback(
    (targetVersion: string) => {
      const targetIndex = versions.findIndex((v) => v.version === targetVersion);
      if (targetIndex !== -1) {
        setVersions(versions.slice(targetIndex));
        setCurrentVersion(targetVersion);
      }
    },
    [versions]
  );

  const getVersion = React.useCallback(
    (version: string) => {
      return versions.find((v) => v.version === version);
    },
    [versions]
  );

  return {
    versions,
    currentVersion,
    addVersion,
    rollback,
    getVersion,
    totalVersions: versions.length,
  };
}

// Component version manager
export interface VersionManagerProps {
  component: ComponentVersion;
  onVersionChange?: (version: string) => void;
  className?: string;
}

export const VersionDisplay: React.FC<VersionManagerProps> = ({
  component,
  onVersionChange,
  className,
}) => {
  const latestVersion = component.versions[0];
  const hasBreaking = component.versions.some((v) => v.breaking);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{component.name}</h3>
          <p className="text-sm text-muted-foreground">
            Current version: {component.currentVersion}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {component.deprecated && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
              Deprecated
            </span>
          )}
          {hasBreaking && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              Breaking Changes
            </span>
          )}
        </div>
      </div>

      {latestVersion && (
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg">{latestVersion.version}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(latestVersion.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{latestVersion.message}</p>
          <div className="flex flex-wrap gap-2">
            {latestVersion.changes.map((change, i) => (
              <span
                key={i}
                className={cn(
                  'px-2 py-0.5 text-xs rounded',
                  change.type === 'added' && 'bg-green-100 text-green-800',
                  change.type === 'modified' && 'bg-blue-100 text-blue-800',
                  change.type === 'deprecated' && 'bg-yellow-100 text-yellow-800',
                  change.type === 'removed' && 'bg-red-100 text-red-800',
                  change.type === 'fixed' && 'bg-purple-100 text-purple-800'
                )}
              >
                {change.type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Version changelog viewer
interface ChangelogViewerProps {
  versions: Version[];
  className?: string;
}

export const ChangelogViewer: React.FC<ChangelogViewerProps> = ({
  versions,
  className,
}) => {
  const [expandedVersion, setExpandedVersion] = React.useState<string | null>(
    versions[0]?.version || null
  );

  return (
    <div className={cn('space-y-4', className)}>
      {versions.map((version) => (
        <div key={version.id} className="border rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
            onClick={() =>
              setExpandedVersion(
                expandedVersion === version.version ? null : version.version
              )
            }
          >
            <div className="flex items-center gap-3">
              <span className="font-mono font-medium">{version.version}</span>
              {version.breaking && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                  Breaking
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(version.timestamp).toLocaleDateString()}
            </span>
          </button>

          {expandedVersion === version.version && (
            <div className="p-4 space-y-4">
              {version.message && (
                <p className="text-sm">{version.message}</p>
              )}

              <div className="space-y-3">
                {(['added', 'modified', 'deprecated', 'removed', 'fixed', 'security'] as const).map((type) => {
                  const changes = version.changes.filter((c) => c.type === type);
                  if (changes.length === 0) return null;

                  return (
                    <div key={type}>
                      <h4 className="text-sm font-medium capitalize mb-2">
                        {type}
                      </h4>
                      <ul className="space-y-1">
                        {changes.map((change, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {change.description}
                            {change.affected.length > 0 && (
                              <span className="ml-2 text-xs">
                                ({change.affected.join(', ')})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-muted-foreground">
                By {version.author}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Version badge component
interface VersionBadgeProps {
  version: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'breaking' | 'deprecated';
}

export const VersionBadge: React.FC<VersionBadgeProps> = ({
  version,
  size = 'md',
  variant = 'default',
}) => {
  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const variants = {
    default: 'bg-primary/10 text-primary',
    breaking: 'bg-red-100 text-red-800',
    deprecated: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={cn(
        'font-mono rounded',
        sizes[size],
        variants[variant]
      )}
    >
      v{version}
    </span>
  );
};

// Export utilities
export const versioningUtils = {
  generate: generateVersion,
  parse: parseVersion,
  compare: compareVersions,
  generateChangelog,
  calculateDiff,
  groupChangesByType,
};
