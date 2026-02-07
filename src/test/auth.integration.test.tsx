import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './utils';
import Auth from '@/pages/Auth';
import { supabase } from '@/integrations/supabase/client';

describe('Auth Page Integration', () => {
    it('renders sign in form by default', async () => {
        const { container } = renderWithProviders(<Auth />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /designforge/i })).toBeInTheDocument();
        });

        // Use ID selector for precision
        const emailInput = container.querySelector('#signin-email');
        expect(emailInput).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates weak password on signup', async () => {
        const { container } = renderWithProviders(<Auth />);
        const user = userEvent.setup();

        // Wait for content to load
        await waitFor(() => expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument());

        // Switch to Sign Up tab
        await user.click(screen.getByRole('tab', { name: /sign up/i }));

        const emailInput = container.querySelector('#signup-email');
        const passwordInput = container.querySelector('#signup-password');

        if (!emailInput || !passwordInput) throw new Error('Inputs not found');

        // Fill form with weak password
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'weak');

        // Submit
        await user.click(screen.getByRole('button', { name: /create account/i }));

        // Expect validation error toast (mocked)
        // Since toast is mocked, we verify the validation logic prevented the signup call
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('calls supabase signUp with correct credentials', async () => {
        const { container } = renderWithProviders(<Auth />);
        const user = userEvent.setup();

        // Wait for content to load
        await waitFor(() => expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument());

        // Switch to Sign Up tab
        await user.click(screen.getByRole('tab', { name: /sign up/i }));

        const emailInput = container.querySelector('#signup-email');
        const passwordInput = container.querySelector('#signup-password');

        if (!emailInput || !passwordInput) throw new Error('Inputs not found');

        // Fill form with strong password
        await user.type(emailInput, 'newuser@example.com');
        await user.type(passwordInput, 'StrongP@ss1'); // >8 chars, Upper, Number, Special

        // Mock successful signup
        (supabase.auth.signUp as any).mockResolvedValueOnce({
            data: { session: { user: { id: '123' } } },
            error: null,
        });

        // Submit
        await user.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'StrongP@ss1',
                options: expect.any(Object),
            });
        });
    });
});
