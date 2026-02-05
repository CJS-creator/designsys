import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock Auth Context
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

// AllTheProviders wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            <TooltipProvider>
                {/* We might need to mock AuthProvider internals if it depends on Supabase heavily */}
                {children}
            </TooltipProvider>
        </BrowserRouter>
    );
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
