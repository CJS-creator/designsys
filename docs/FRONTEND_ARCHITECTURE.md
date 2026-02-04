# DesignForge Frontend Architecture Documentation

## Overview

DesignForge is built using modern web technologies with React, TypeScript, Vite, and Tailwind CSS. This document provides a comprehensive overview of the frontend architecture, including project structure, state management, performance optimization strategies, and security best practices.

---

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | React | 18+ | UI Component Library |
| Language | TypeScript | 5+ | Type Safety |
| Build Tool | Vite | 5+ | Fast Development & Building |
| Styling | Tailwind CSS | 3+ | Utility-First Styling |
| State Management | React Context + Zustand | - | Global State |
| Routing | React Router | 6+ | Client-Side Routing |
| Animation | Framer Motion | 10+ | Complex Animations |
| Forms | React Hook Form | 7+ | Form Management |
| Validation | Zod | 3+ | Schema Validation |
| Testing | Vitest | 1+ | Unit Testing |
| Linting | ESLint | 8+ | Code Quality |
| Formatting | Prettier | 3+ | Code Formatting |

---

## Project Structure

```
designsys/
├── .vscode/                  # VSCode configuration
│   ├── extensions.json       # Recommended extensions
│   └── settings.json         # Editor settings
├── public/                   # Static assets
│   ├── favicon.ico          # App favicon
│   ├── og-image.png         # Social sharing image
│   └── placeholder.svg      # Placeholder images
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── animations/      # Animation components
│   │   │   ├── TextReveal.tsx
│   │   │   ├── ParallaxCard.tsx
│   │   │   └── ...
│   │   ├── landing/         # Landing page components
│   │   │   ├── LandingHero.tsx
│   │   │   ├── LandingFeatures.tsx
│   │   │   └── ...
│   │   ├── tokens/          # Token management
│   │   │   ├── TokenEditor.tsx
│   │   │   ├── TokenList.tsx
│   │   │   └── ...
│   │   ├── auth/            # Authentication
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── docs/            # Documentation
│   │   │   ├── DocEditor.tsx
│   │   │   └── ...
│   │   ├── exporters/       # Export utilities
│   │   │   └── CustomExporterEditor.tsx
│   │   ├── marketplace/     # Marketplace features
│   │   │   └── Marketplace.tsx
│   │   ├── onboarding/      # Onboarding flow
│   │   │   ├── OnboardingModal.tsx
│   │   │   ├── OnboardingTour.tsx
│   │   │   └── ...
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Index.tsx
│   │   ├── Auth.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── ...
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   ├── formatters.ts
│   │   └── ...
│   ├── styles/             # Global styles
│   │   ├── index.css
│   │   └── App.css
│   ├── lib/                # Core libraries
│   │   ├── api.ts          # API client
│   │   ├── auth.ts         # Authentication
│   │   └── ...
│   ├── types/              # TypeScript types
│   │   ├── user.ts
│   │   ├── design.ts
│   │   └── ...
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite types
├── docs/                   # Documentation
├── .gitignore             # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── package.json           # Dependencies
├── postcss.config.js      # PostCSS config
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.app.json     # TypeScript app config
├── tsconfig.json         # TypeScript base config
├── tsconfig.node.json    # TypeScript node config
├── vite.config.ts        # Vite configuration
└── vitest.config.ts      # Vitest configuration
```

---

## State Management

### React Context

DesignForge uses React Context for theme state and authentication state:

```tsx
// Theme Context Example
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Sync with localStorage and document
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
```

### Zustand Store

For complex global state, Zustand is used:

```tsx
import { create } from 'zustand'

interface DesignState {
  selectedTokens: string[]
  activeBrand: string | null
  setSelectedTokens: (tokens: string[]) => void
  addToken: (token: string) => void
  removeToken: (token: string) => void
  setActiveBrand: (brandId: string | null) => void
}

export const useDesignStore = create<DesignState>((set) => ({
  selectedTokens: [],
  activeBrand: null,
  setSelectedTokens: (tokens) => set({ selectedTokens: tokens }),
  addToken: (token) =>
    set((state) => ({
      selectedTokens: [...state.selectedTokens, token],
    })),
  removeToken: (token) =>
    set((state) => ({
      selectedTokens: state.selectedTokens.filter((t) => t !== token),
    })),
  setActiveBrand: (brandId) => set({ activeBrand: brandId }),
}))
```

### Component-Level State

For component-specific state, use React's built-in hooks:

```tsx
// useState for simple state
const [isOpen, setIsOpen] = useState(false)

// useReducer for complex state logic
const [state, dispatch] = useReducer(reducer, initialState)

// useCallback for memoized callbacks
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])

// useMemo for memoized values
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

---

## API Integration

### API Client Configuration

```tsx
// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
```

### API Service Functions

```tsx
// src/services/designService.ts
import api from '@/lib/api'
import { Design, CreateDesignRequest, UpdateDesignRequest } from '@/types/design'

export const designService = {
  async getAll(): Promise<Design[]> {
    const response = await api.get<Design[]>('/designs')
    return response.data
  },

  async getById(id: string): Promise<Design> {
    const response = await api.get<Design>(`/designs/${id}`)
    return response.data
  },

  async create(data: CreateDesignRequest): Promise<Design> {
    const response = await api.post<Design>('/designs', data)
    return response.data
  },

  async update(id: string, data: UpdateDesignRequest): Promise<Design> {
    const response = await api.put<Design>(`/designs/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/designs/${id}`)
  },
}
```

### Custom Hooks for Data Fetching

```tsx
// src/hooks/useDesigns.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { designService } from '@/services/designService'

export function useDesigns() {
  return useQuery({
    queryKey: ['designs'],
    queryFn: designService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDesign(id: string) {
  return useQuery({
    queryKey: ['designs', id],
    queryFn: () => designService.getById(id),
    enabled: !!id,
  })
}

export function useCreateDesign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: designService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designs'] })
    },
  })
}
```

---

## Performance Optimization

### Code Splitting

```tsx
// Lazy load components
const LandingPage = lazy(() => import('@/pages/Landing'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DesignEditor = lazy(() => import('@/pages/DesignEditor'))

// Use Suspense for loading states
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:id" element={<DesignEditor />} />
      </Routes>
    </Suspense>
  )
}
```

### Memoization

```tsx
import { memo, useMemo } from 'react'

// Memoize expensive components
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: { data: Data }) {
  // Component logic
})

// Memoize callback props
const handleClick = useCallback(() => {
  doSomething()
}, [dependency])

// Memoize expensive computations
const processedData = useMemo(() => {
  return data.map(item => transform(item))
}, [data])
```

### Image Optimization

```tsx
// Use appropriate image formats and sizes
<img 
  src="/image.webp" 
  alt="Description"
  loading="lazy"
  srcSet="/image-400.webp 400w, /image-800.webp 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Virtual List for Large Data

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })
  
  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Bundle Optimization

```tsx
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          animation: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

---

## Security Best Practices

### XSS Prevention

```tsx
// Never use dangerouslySetInnerHTML with user input
// Instead, sanitize input
import DOMPurify from 'dompurify'

const sanitizedContent = DOMPurify.sanitize(userContent)

// Use React's built-in escaping
// React automatically escapes content in JSX
<div>{userContent}</div> // Safe
```

### CSRF Protection

```tsx
// Include CSRF token in requests
api.defaults.headers.common['X-CSRF-Token'] = getCsrfToken()

// Validate CSRF on server
```

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://analytics.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
">
```

### Authentication Security

```tsx
// Store tokens securely
// Use httpOnly cookies for sensitive data
// Implement proper session management

// Validate tokens on every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token && isTokenExpired(token)) {
    return refreshToken().then(() => config)
  }
  return config
})
```

### Input Validation

```tsx
import { z } from 'zod'

const designSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  tokens: z.array(z.string()).min(1),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    fontSize: z.number().min(12).max(24),
  }),
})

function createDesign(data: unknown) {
  const validated = designSchema.parse(data)
  // Proceed with validated data
}
```

---

## Testing Strategy

### Unit Testing with Vitest

```tsx
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Integration Testing

```tsx
// src/pages/DesignEditor/DesignEditor.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { DesignEditor } from './DesignEditor'

describe('DesignEditor', () => {
  it('creates a new design', async () => {
    const user = userEvent.setup()
    render(<DesignEditor />)
    
    await user.click(screen.getByText('New Design'))
    await user.type(screen.getByLabelText('Name'), 'My Design')
    await user.click(screen.getByText('Save'))
    
    await waitFor(() => {
      expect(screen.getByText('Design created')).toBeInTheDocument()
    })
  })
})
```

### Component Testing

```tsx
// src/components/ui/Button/Button.test.tsx
import { Button } from './Button'
import { checkAccessibility } from '@/test/utils/accessibility'

describe('Button Accessibility', () => {
  it('meets WCAG guidelines', async () => {
    const { container } = render(
      <Button variant="primary">Click me</Button>
    )
    await checkAccessibility(container)
  })
})
```

### Test Coverage

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui"
  },
  "vitest": {
    "coverage": {
      "provider": "v8",
      "reporter": ["text", "json", "html"],
      "lines": 80,
      "functions": 80,
      "branches": 80,
      "statements": 80
    }
  }
}
```

---

## Build & Deployment

### Build Configuration

```tsx
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
```

### Environment Variables

```
# .env.production
VITE_API_URL=https://api.designforge.io
VITE_ANALYTICS_ID=GA-XXXXXXXX
VITE_FEATURE_FLAGS=dark_mode:true,collaboration:false

# .env.development
VITE_API_URL=http://localhost:4000
VITE_ANALYTICS_ID=
VITE_FEATURE_FLAGS=dark_mode:true,collaboration:true
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build
        run: npm run build
        
      - name: Upload artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
```

---

## Accessibility Implementation

### ARIA Standards

```tsx
// Proper ARIA attributes
<button
  aria-label="Close modal"
  aria-describedby="modal-description"
  aria-expanded={isOpen}
  aria-controls="modal-content"
  aria-modal="true"
  role="dialog"
>
  <span id="modal-description" className="sr-only">
    A dialog for creating a new design
  </span>
  <IconX />
</button>
```

### Keyboard Navigation

```tsx
// Focus management
function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements?.[0]
      firstElement?.focus()
    }
  }, [isOpen])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])
  
  return (
    <div
      ref={modalRef}
      role="document"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}
```

### Screen Reader Support

```tsx
// Announce dynamic content changes
import { announce } from '@/utils/accessibility'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  
  useEffect(() => {
    announce(`${notifications.length} new notifications`)
  }, [notifications])
  
  return (
    <ul aria-live="polite" aria-atomic="false">
      {notifications.map(n => (
        <li key={n.id}>{n.message}</li>
      ))}
    </ul>
  )
}
```

---

## Related Documentation

- [Design System Documentation](./DESIGN_SYSTEM_DOCUMENTATION.md)
- [Component Library Documentation](./COMPONENT_LIBRARY.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
