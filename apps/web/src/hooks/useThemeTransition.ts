import { useEffect } from 'react';

// Theme transition duration in milliseconds
const THEME_TRANSITION_DURATION = 300;

// CSS for preventing FOUC (Flash of Unstyled Content)
export const foucPreventionStyles = `
  :root:not(.theme-loaded) * {
    transition: none !important;
    animation: none !important;
  }
  
  :root:not(.theme-loaded) {
    visibility: hidden;
  }
  
  :root.theme-loaded {
    visibility: visible;
  }
  
  @keyframes theme-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .theme-loaded {
    animation: theme-fade-in 0.3s ease-out;
  }
`;

// Inject FOUC prevention styles
export function injectFOUCStyles(): void {
    if (typeof document === 'undefined') return;

    const id = 'theme-fouc-styles';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = foucPreventionStyles;
    document.head.appendChild(style);
}

// Hook for smooth theme transitions
export function useThemeTransition(duration: number = THEME_TRANSITION_DURATION) {
    useEffect(() => {
        // Set transition duration on root
        document.documentElement.style.setProperty('--theme-transition-duration', `${duration}ms`);

        // Create and inject transition styles
        const style = document.createElement('style');
        style.textContent = `
      :root,
      :root * {
        transition: 
          background-color ${duration}ms ease-out,
          color ${duration}ms ease-out,
          border-color ${duration}ms ease-out,
          box-shadow ${duration}ms ease-out,
          fill ${duration}ms ease-out,
          stroke ${duration}ms ease-out,
          opacity ${duration}ms ease-out;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.documentElement.style.removeProperty('--theme-transition-duration');
            document.head.removeChild(style);
        };
    }, [duration]);
}

// Hook for theme loading state
export function useThemeLoaded() {
    useEffect(() => {
        // Mark theme as loaded
        injectFOUCStyles();
        document.documentElement.classList.add('theme-loaded');

        // Remove theme-loaded after animation completes
        const timeout = setTimeout(() => {
            document.documentElement.classList.remove('theme-loaded');
        }, THEME_TRANSITION_DURATION);

        return () => clearTimeout(timeout);
    }, []);
}

// Color scheme type
export type ColorScheme = 'light' | 'dark' | 'system';

// Color scheme configurations
export const colorSchemes: Record<ColorScheme, { background: string; foreground: string }> = {
    light: {
        background: '0 0% 100%',
        foreground: '0 0% 3.9%',
    },
    dark: {
        background: '0 0% 3.9%',
        foreground: '0 0% 98%',
    },
    system: {
        background: '0 0% 100%',
        foreground: '0 0% 3.9%',
    },
};

// Get resolved color scheme based on system preference
export function getResolvedColorScheme(scheme: ColorScheme): 'light' | 'dark' {
    if (scheme === 'system') {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return scheme;
}

// Hook for managing color scheme with smooth transitions
export function useColorScheme() {
    // Apply theme loaded state
    useThemeLoaded();

    // Apply theme transitions
    useThemeTransition();

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem('color-scheme') as ColorScheme | null;
            if (stored === 'system') {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);
}

// Theme configuration interface
export interface ThemeConfiguration {
    id: string;
    name: string;
    colorScheme: ColorScheme;
    accentColor: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    fontScale: number;
    reducedMotion: 'auto' | 'always' | 'never';
}

// Default theme configuration
export const defaultTheme: ThemeConfiguration = {
    id: 'default',
    name: 'Default',
    colorScheme: 'system',
    accentColor: '#3b82f6',
    borderRadius: 'lg',
    fontScale: 1,
    reducedMotion: 'auto',
};

// Generate CSS variables for a theme configuration
export function generateThemeCSS(theme: ThemeConfiguration): string {
    const resolvedScheme = getResolvedColorScheme(theme.colorScheme);
    const colors = colorSchemes[resolvedScheme];

    return `
    :root[data-theme="${theme.id}"] {
      --color-scheme: ${resolvedScheme};
      --accent-color: ${theme.accentColor};
      --border-radius: var(--radius-${theme.borderRadius});
      --font-scale: ${theme.fontScale};
      --reduced-motion: ${theme.reducedMotion === 'always' ? 'reduce' : theme.reducedMotion === 'never' ? 'no-preference' : 'auto'};
      
      /* Primary colors */
      --primary: ${theme.accentColor};
      --primary-foreground: ${resolvedScheme === 'dark' ? '0 0% 98%' : '0 0% 100%'};
      
      /* Background and foreground */
      --background: ${colors.background};
      --foreground: ${colors.foreground};
      
      /* Card colors */
      --card: ${colors.background};
      --card-foreground: ${colors.foreground};
      
      /* Popover colors */
      --popover: ${colors.background};
      --popover-foreground: ${colors.foreground};
      
      /* Border colors */
      --border: ${resolvedScheme === 'dark' ? '0 0% 14.9%' : '0 0% 90.9%'};
      --input: ${resolvedScheme === 'dark' ? '0 0% 14.9%' : '0 0% 90.9%'};
      --ring: ${theme.accentColor};
      
      /* Muted colors */
      --muted: ${resolvedScheme === 'dark' ? '0 0% 14.9%' : '0 0% 96.9%'};
      --muted-foreground: ${resolvedScheme === 'dark' ? '0 0% 63.9%' : '0 0% 45.1%'};
      
      /* Destructive colors */
      --destructive: ${resolvedScheme === 'dark' ? '0 62.8% 30.6%' : '0 84.2% 60.2%'};
      --destructive-foreground: ${resolvedScheme === 'dark' ? '0 0% 98%' : '0 0% 98%'};
      
      /* Success colors */
      --success: ${resolvedScheme === 'dark' ? '142.1 76.2% 36.9%' : '142.1 70.6% 45.3%'};
      --success-foreground: ${resolvedScheme === 'dark' ? '0 0% 98%' : '0 0% 100%'};
      
      /* Warning colors */
      --warning: ${resolvedScheme === 'dark' ? '45.4 93.4% 47.5%' : '45.4 93.4% 47.5%'};
      --warning-foreground: ${resolvedScheme === 'dark' ? '0 0% 0%' : '0 0% 0%'};
    }
  `;
}

// Apply theme to document
export function applyTheme(theme: ThemeConfiguration): void {
    if (typeof document === 'undefined') return;

    injectFOUCStyles();

    // Remove existing theme styles
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
        existingStyle.remove();
    }

    // Inject new theme styles
    const style = document.createElement('style');
    style.id = 'theme-variables';
    style.textContent = generateThemeCSS(theme);
    document.head.appendChild(style);

    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', theme.id);

    // Apply color scheme class
    const resolvedScheme = getResolvedColorScheme(theme.colorScheme);
    document.documentElement.classList.toggle('dark', resolvedScheme === 'dark');

    // Apply reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldReduceMotion = theme.reducedMotion === 'always' || (theme.reducedMotion === 'auto' && prefersReducedMotion);
    document.documentElement.classList.toggle('reduce-motion', shouldReduceMotion);

    // Store theme preference
    localStorage.setItem('color-scheme', theme.colorScheme);
    localStorage.setItem('accent-color', theme.accentColor);
    localStorage.setItem('border-radius', theme.borderRadius);
}

// Save theme to localStorage
export function saveTheme(theme: ThemeConfiguration): void {
    localStorage.setItem('theme', JSON.stringify(theme));
}

// Load theme from localStorage
export function loadTheme(): ThemeConfiguration | null {
    if (typeof localStorage === 'undefined') return null;

    const stored = localStorage.getItem('theme');
    if (!stored) return null;

    try {
        return JSON.parse(stored) as ThemeConfiguration;
    } catch {
        return null;
    }
}
