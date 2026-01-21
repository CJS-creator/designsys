import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EnhancedHover, EnhancedButton } from '../enhanced-interactions';

describe('EnhancedHover', () => {
    it('renders children correctly', () => {
        render(<EnhancedHover>Test Content</EnhancedHover>);
        expect(screen.getByText('Test Content')).toBeTruthy();
    });
});

describe('EnhancedButton', () => {
    it('renders as a button', () => {
        render(<EnhancedButton>Click me</EnhancedButton>);
        expect(screen.getByRole('button')).toBeTruthy();
    });

    it('displays loading state', () => {
        render(<EnhancedButton loading>Click me</EnhancedButton>);
        expect(screen.getByText('Click me')).toBeTruthy();
    });
});
