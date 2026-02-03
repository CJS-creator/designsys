-- Migration for Premium Preset Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    author TEXT,
    category TEXT DEFAULT 'foundation',
    icon TEXT,
    is_premium BOOLEAN DEFAULT false,
    price_cents INTEGER DEFAULT 0,
    preset_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_presets ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Marketplace presets are viewable by everyone'
    ) THEN
        CREATE POLICY "Marketplace presets are viewable by everyone"
        ON public.marketplace_presets FOR SELECT
        USING (true);
    END IF;
END $$;

-- Seed data for primary presets
INSERT INTO public.marketplace_presets (name, description, author, category, icon, is_premium, preset_data)
VALUES 
('Apple HIG Foundation', 'Official Apple Human Interface Guidelines foundations: San Francisco, system colors, and dynamic type.', 'Apple Inc.', 'foundation', 'Apple', false, '{
  "name": "Apple HIG",
  "colors": {
    "primary": "#007AFF",
    "secondary": "#5856D6",
    "accent": "#FF2D55",
    "background": "#F2F2F7",
    "surface": "#FFFFFF",
    "text": "#000000",
    "textSecondary": "#3C3C43",
    "success": "#34C759",
    "warning": "#FF9500",
    "error": "#FF3B30"
  },
  "typography": {
    "fontFamily": {
      "heading": "SF Pro Display",
      "body": "SF Pro Text",
      "mono": "SF Mono"
    },
    "sizes": {
      "xs": "12px",
      "sm": "14px",
      "md": "17px",
      "lg": "20px",
      "xl": "24px",
      "2xl": "34px",
      "3xl": "48px"
    }
  },
  "spacing": { "scale": { "xs": "4px", "sm": "8px", "md": "16px", "lg": "32px", "xl": "64px" } },
  "borderRadius": { "sm": "4px", "md": "10px", "lg": "20px", "full": "9999px" },
  "grid": { "columns": 12, "gutter": "16px", "margin": "16px", "maxWidth": "1200px", "breakpoints": { "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px" } }
}'),
('Material 3 Design', 'Google Material 3 design system with dynamic color seeds and elevation system.', 'Google', 'foundation', 'Palette', false, '{
  "name": "Material 3",
  "colors": {
    "primary": "#6750A4",
    "secondary": "#625B71",
    "accent": "#7D5260",
    "background": "#FEF7FF",
    "surface": "#F3EDF7",
    "text": "#1D1B20",
    "textSecondary": "#49454F",
    "success": "#21005D",
    "warning": "#E6E1E5",
    "error": "#B3261E"
  },
  "typography": {
    "fontFamily": {
      "heading": "Roboto",
      "body": "Roboto",
      "mono": "Roboto Mono"
    },
    "sizes": {
      "xs": "11px",
      "sm": "12px",
      "md": "14px",
      "lg": "16px",
      "xl": "22px",
      "2xl": "24px",
      "3xl": "28px"
    }
  },
  "spacing": { "scale": { "xs": "4px", "sm": "8px", "md": "12px", "lg": "16px", "xl": "24px" } },
  "borderRadius": { "none": "0px", "xs": "4px", "sm": "8px", "md": "12px", "lg": "16px", "xl": "28px", "full": "9999px" },
  "grid": { "columns": 12, "gutter": "24px", "margin": "24px", "maxWidth": "1440px", "breakpoints": { "mobile": "0px", "tablet": "600px", "desktop": "1240px" } }
}'),
('Tailwind Default', 'The standard Tailwind CSS v4 design tokens: spacing, colors, and shadows.', 'Tailwind Labs', 'foundation', 'Wind', false, '{
  "name": "Tailwind v4",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "surface": "#F9FAFB",
    "text": "#111827",
    "textSecondary": "#4B5563",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "error": "#EF4444"
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter",
      "body": "Inter",
      "mono": "ui-monospace"
    },
    "sizes": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "md": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    }
  },
  "spacing": { "scale": { "xs": "0.25rem", "sm": "0.5rem", "md": "1rem", "lg": "2rem", "xl": "4rem" } },
  "borderRadius": { "sm": "0.125rem", "md": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
  "grid": { "columns": 12, "gutter": "1rem", "margin": "1rem", "maxWidth": "1280px", "breakpoints": { "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px", "2xl": "1536px" } }
}');
