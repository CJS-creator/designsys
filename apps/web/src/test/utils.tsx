import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Create a custom render function that includes providers
const renderWithProviders = (
    ui: React.ReactElement,
    {
        route = '/',
        ...options
    }: RenderOptions & { route?: string } = {}
) => {
    window.history.pushState({}, 'Test page', route);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => {
        return (
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AuthProvider>
                        {children}
                        <Toaster />
                    </AuthProvider>
                </BrowserRouter>
            </QueryClientProvider>
        );
    };

    return {
        user: {
            // Add user checks helper if needed
        },
        ...render(ui, { wrapper: Wrapper, ...options }),
    };
};

export * from '@testing-library/react';
export { renderWithProviders };
