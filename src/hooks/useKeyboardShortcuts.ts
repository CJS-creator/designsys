import { useEffect, useCallback } from "react";
import { toast } from "sonner";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : true;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Predefined shortcuts for the design system app
export function useDesignSystemShortcuts({
  onGenerate,
  onSave,
  onExport,
  onReset,
  isGenerating = false,
  hasDesignSystem = false,
}: {
  onGenerate?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  isGenerating?: boolean;
  hasDesignSystem?: boolean;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (onGenerate) {
    shortcuts.push({
      key: "Enter",
      ctrlKey: true,
      action: () => {
        if (!isGenerating) {
          onGenerate();
          toast.info("Generating design system...", { duration: 1500 });
        }
      },
      description: "Generate design system",
    });
  }

  if (onSave && hasDesignSystem) {
    shortcuts.push({
      key: "s",
      ctrlKey: true,
      action: () => {
        onSave();
        toast.info("Saving design system...", { duration: 1500 });
      },
      description: "Save design system",
    });
  }

  if (onExport && hasDesignSystem) {
    shortcuts.push({
      key: "e",
      ctrlKey: true,
      action: () => {
        onExport();
        toast.info("Opening export options...", { duration: 1500 });
      },
      description: "Export design system",
    });
  }

  if (onReset && hasDesignSystem) {
    shortcuts.push({
      key: "Escape",
      action: () => {
        onReset();
      },
      description: "Go back / Reset",
    });
  }

  useKeyboardShortcuts({ shortcuts, enabled: true });

  return shortcuts;
}

// Help component to show available shortcuts
export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) {
    parts.push(navigator.platform.includes("Mac") ? "⌘" : "Ctrl");
  }
  
  if (shortcut.shiftKey) {
    parts.push("Shift");
  }
  
  const keyDisplay = shortcut.key === "Enter" ? "↵" : 
                    shortcut.key === "Escape" ? "Esc" : 
                    shortcut.key.toUpperCase();
  parts.push(keyDisplay);
  
  return parts.join(" + ");
}
