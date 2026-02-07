import { GeneratedDesignSystem } from "@/types/designSystem";

export type Framework = "react" | "vue" | "swiftui" | "flutter";

export interface ComponentTemplate {
    name: string;
    description: string;
    generate: (ds: GeneratedDesignSystem, framework: Framework) => string;
}

export const componentGenerator = {
    generate: (ds: GeneratedDesignSystem, framework: Framework, component: string): string => {
        switch (component) {
            case "button":
                return generateButton(ds, framework);
            case "card":
                return generateCard(ds, framework);
            case "input":
                return generateInput(ds, framework);
            case "badge":
                return generateBadge(ds, framework);
            default:
                return `// Component ${component} not implemented for ${framework}`;
        }
    },
    generateStory: (ds: GeneratedDesignSystem, component: string): string => {
        const componentName = component.charAt(0).toUpperCase() + component.slice(1);
        return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  tags: ['autodocs'],
  argTypes: {
    // Dynamic argTypes based on design system
  },
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    label: '${componentName}',
    primary: true,
  },
};

export const ${ds.name.replace(/\s+/g, '')}Variant: Story = {
  args: {
    variant: 'primary',
    // Injected from ${ds.name}
    style: {
      borderRadius: '${ds.borderRadius.md}',
      fontFamily: '${ds.typography.fontFamily.body}'
    }
  },
};`;
    }
};

function generateButton(ds: GeneratedDesignSystem, framework: Framework): string {
    if (framework === "react") {
        return `import React from 'react';
import { cn } from './utils'; // Assuming a utility for tailwind class merging

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className, 
    ...props 
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-${ds.borderRadius.sm}',
        md: 'px-4 py-2 text-sm rounded-${ds.borderRadius.md}',
        lg: 'px-6 py-3 text-base rounded-${ds.borderRadius.lg}'
    };

    const variants = {
        primary: 'bg-[${ds.colors.primary}] text-[${ds.colors.onPrimary}] hover:opacity-90 active:scale-95 shadow-[${ds.shadows.sm}]',
        secondary: 'bg-[${ds.colors.secondary}] text-[${ds.colors.onSecondary}] hover:opacity-90 active:scale-95',
        outline: 'border-2 border-[${ds.colors.primary}] text-[${ds.colors.primary}] hover:bg-[${ds.colors.primary}]/5',
        ghost: 'text-[${ds.colors.textSecondary}] hover:bg-[${ds.colors.primary}]/5'
    };

    return (
        <button 
            className={cn(baseStyles, sizes[size], variants[variant], className)}
            style={{ 
                fontFamily: '${ds.typography.fontFamily.body}',
                transitionDuration: '${ds.animations.duration.normal}'
            }}
            {...props}
        >
            {children}
        </button>
    );
};`;
    }

    if (framework === "vue") {
        return `<template>
  <button 
    :class="[
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses[size],
      variantClasses[variant]
    ]"
    :style="{ 
      fontFamily: '${ds.typography.fontFamily.body}',
      transitionDuration: '${ds.animations.duration.normal}'
    }"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
});

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-${ds.borderRadius.sm}',
  md: 'px-4 py-2 text-sm rounded-${ds.borderRadius.md}',
  lg: 'px-6 py-3 text-base rounded-${ds.borderRadius.lg}'
};

const variantClasses = {
  primary: 'bg-[${ds.colors.primary}] text-[${ds.colors.onPrimary}] hover:opacity-90 active:scale-95 shadow-[${ds.shadows.sm}]',
  secondary: 'bg-[${ds.colors.secondary}] text-[${ds.colors.onSecondary}] hover:opacity-90 active:scale-95',
  outline: 'border-2 border-[${ds.colors.primary}] text-[${ds.colors.primary}] hover:bg-[${ds.colors.primary}]/5',
  ghost: 'text-[${ds.colors.textSecondary}] hover:bg-[${ds.colors.primary}]/5'
};
</script>`;
    }

    return `// ${framework} generator for Button is under development`;
}

function generateCard(ds: GeneratedDesignSystem, framework: Framework): string {
    if (framework === "react") {
        return `import React from 'react';

export const Card = ({ title, subtitle, children, footer }) => {
    return (
        <div 
            className="overflow-hidden border border-[${ds.colors.border}] bg-[${ds.colors.surface}] shadow-[${ds.shadows.md}] rounded-[${ds.borderRadius.lg}]"
            style={{ fontFamily: '${ds.typography.fontFamily.body}' }}
        >
            {(title || subtitle) && (
                <div className="p-6 pb-0">
                    {title && <h3 className="text-lg font-bold text-[${ds.colors.text}]">${ds.typography.weights.semibold}</h3>}
                    {subtitle && <p className="text-sm text-[${ds.colors.textSecondary}]">${ds.typography.weights.normal}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-[${ds.colors.background}]/50 border-t border-[${ds.colors.border}]">
                    {footer}
                </div>
            )}
        </div>
    );
};`;
    }
    return `// ${framework} generator for Card is under development`;
}

function generateBadge(ds: GeneratedDesignSystem, framework: Framework): string {
    if (framework === "react") {
        return `import React from 'react';

export const Badge = ({ children, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-[${ds.colors.primary}]/10 text-[${ds.colors.primary}] border-[${ds.colors.primary}]/20',
        secondary: 'bg-[${ds.colors.secondary}]/10 text-[${ds.colors.secondary}] border-[${ds.colors.secondary}]/20',
        success: 'bg-[${ds.colors.success}]/10 text-[${ds.colors.success}] border-[${ds.colors.success}]/20',
        error: 'bg-[${ds.colors.error}]/10 text-[${ds.colors.error}] border-[${ds.colors.error}]/20',
    };

    return (
        <span className={\`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border \${variants[variant]}\`}>
            {children}
        </span>
    );
};`;
    }
    return `// ${framework} generator for Badge is under development`;
}

function generateInput(ds: GeneratedDesignSystem, framework: Framework): string {
    if (framework === "react") {
        return `import React from 'react';

export const Input = ({ label, error, helperText, ...props }) => {
    return (
        <div className="space-y-1 w-full">
            {label && (
                <label className="text-xs font-bold text-[${ds.colors.textSecondary}] uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <input 
                className={\`w-full px-4 py-2 bg-[${ds.colors.background}] border \${error ? 'border-[${ds.colors.error}]' : 'border-[${ds.colors.border}]'} rounded-[${ds.borderRadius.md}] focus:ring-2 focus:ring-[${ds.colors.primary}]/20 focus:border-[${ds.colors.primary}] outline-none transition-all shadow-[${ds.shadows.sm}]\`}
                style={{ fontFamily: '${ds.typography.fontFamily.body}' }}
                {...props}
            />
            {(error || helperText) && (
                <p className={\`text-[10px] px-1 \${error ? 'text-[${ds.colors.error}]' : 'text-[${ds.colors.textSecondary}]'}\`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};`;
    }
    return `// ${framework} generator for Input is under development`;
}
