import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { useTheme } from "next-themes";

const TOUR_STEPS = [
    {
        element: "#tour-input-section",
        popover: {
            title: "Start Designing",
            description: "Describe your dream app here. Use the 'Surprise Me' button for inspiration!",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#tour-presets",
        popover: {
            title: "Quick Start Presets",
            description: "Or pick a pre-made system to jumpstart your process.",
            side: "top",
            align: "start",
        },
    },
    {
        element: "#tour-tabs",
        popover: {
            title: "Explore Your System",
            description: "Navigate through Colors, Typography, Components, and more.",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#tour-export",
        popover: {
            title: "Export Anywhere",
            description: "Download your system as CSS, JSON, or Tailwind config.",
            side: "left",
            align: "start",
        },
    },
] as const;

import { forwardRef } from "react";

export const FeatureTour = forwardRef<HTMLDivElement>((_, ref) => {
    const { theme } = useTheme();

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("has_seen_tour");

        // Check if driver is properly imported
        if (!driver) return;

        if (!hasSeenTour) {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                allowClose: true,
                overlayColor: theme === 'dark' ? '#000000' : '#ffffff',
                onDestroyed: () => {
                    localStorage.setItem("has_seen_tour", "true");
                },
                steps: TOUR_STEPS as any
            });

            // Small delay to ensure DOM is ready
            setTimeout(() => {
                driverObj.drive();
            }, 1500);
        }
    }, [theme]);

    return <div ref={ref} style={{ display: 'none' }} aria-hidden="true" />;
});

FeatureTour.displayName = "FeatureTour";
