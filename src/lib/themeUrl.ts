import { GeneratedDesignSystem } from "@/types/designSystem";
import { deflate, inflate } from "pako";

/**
 * Encodes a design system as a URL-safe base64 string suitable for use in a hash.
 * Intended for sharing the *exact* state without a server round-trip.
 *
 * Format: prefix + base64url(payload)
 *   prefix "z:" → DEFLATE-compressed JSON (default for new links — much shorter)
 *   no prefix  → legacy uncompressed JSON (still decoded for backwards compat)
 */
const COMPRESSED_PREFIX = "z:";

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toBase64Url(input: string): string {
  return bytesToBase64Url(new TextEncoder().encode(input));
}

function fromBase64Url(input: string): string {
  return new TextDecoder().decode(base64UrlToBytes(input));
}

export const MAX_THEME_URL_LENGTH = 7000;

export function encodeTheme(ds: GeneratedDesignSystem): string {
  // Strip volatile/server-only fields to keep the payload compact.
  const { id: _id, live_version_id: _live, ...slim } = ds;
  void _id;
  void _live;
  const json = JSON.stringify(slim);
  // DEFLATE then base64url. Typical theme payloads compress 4–6×, which keeps
  // shared links comfortably below most URL length limits.
  try {
    const compressed = deflate(json, { level: 9 });
    return COMPRESSED_PREFIX + bytesToBase64Url(compressed);
  } catch {
    // Extremely unlikely, but fall back to the legacy uncompressed format.
    return toBase64Url(json);
  }
}

export function buildThemeUrl(ds: GeneratedDesignSystem, base?: string): string {
  const origin = base ?? (typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "");
  const encoded = encodeTheme(ds);
  return `${origin}#theme=${encoded}`;
}

/**
 * Defaults applied when an older/partial theme payload is decoded.
 * Keeps the schema forward-compatible: missing branches are filled in
 * rather than rejected, so links shared from previous app versions still load.
 */
const THEME_DEFAULTS = {
  name: "Shared theme",
  description: "",
  typography: {
    fontFamily: { heading: "Inter", body: "Inter", mono: "JetBrains Mono" },
    sizes: { xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "20px", "2xl": "24px", "3xl": "30px", "4xl": "36px", "5xl": "48px" },
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
    lineHeights: { tight: "1.2", normal: "1.5", relaxed: "1.75" },
  },
  spacing: {
    unit: 4,
    scale: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px", "8": "32px", "10": "40px", "12": "48px", "16": "64px", "20": "80px", "24": "96px" },
  },
  shadows: { none: "none", sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.1)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)", "2xl": "0 25px 50px rgba(0,0,0,0.25)", inner: "inset 0 2px 4px rgba(0,0,0,0.06)" },
  borderRadius: { none: "0", sm: "2px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px", full: "9999px" },
  grid: { columns: 12, gutter: "24px", margin: "16px", maxWidth: "1280px", breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" } },
  animations: {
    duration: { instant: "0ms", fast: "150ms", normal: "300ms", slow: "500ms", slower: "750ms" },
    easing: { linear: "linear", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", spring: "cubic-bezier(0.34,1.56,0.64,1)", bounce: "cubic-bezier(0.68,-0.55,0.265,1.55)" },
    transitions: { fade: "opacity 300ms ease", scale: "transform 300ms ease", slide: "transform 300ms ease", all: "all 300ms ease", colors: "color 300ms ease", transform: "transform 300ms ease" },
  },
} as const;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge: values from `incoming` win, but missing branches fall back to defaults. */
function mergeWithDefaults<T>(defaults: T, incoming: unknown): T {
  if (!isPlainObject(defaults as unknown)) {
    return (incoming === undefined || incoming === null ? defaults : (incoming as T));
  }
  if (!isPlainObject(incoming)) return defaults;
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [k, v] of Object.entries(incoming)) {
    const d = (defaults as Record<string, unknown>)[k];
    out[k] = isPlainObject(d) && isPlainObject(v) ? mergeWithDefaults(d, v) : v;
  }
  return out as T;
}

export function decodeThemeFromHash(hash: string): GeneratedDesignSystem | null {
  if (!hash) return null;
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
  // Accept either #theme=... or just the encoded string after the hash
  const params = new URLSearchParams(cleaned);
  const value = params.get("theme") ?? (cleaned.startsWith("theme=") ? cleaned.slice(6) : null);
  if (!value) return null;
  try {
    const json = fromBase64Url(value);
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== "object") return null;
    // A theme is only useful if at least colors are present.
    if (!isPlainObject((parsed as Record<string, unknown>).colors)) return null;

    // Backfill any missing branches (older shared links) with sensible defaults
    // so the UI doesn't crash on missing typography.sizes, animations.*, etc.
    const merged = {
      ...mergeWithDefaults(THEME_DEFAULTS, parsed),
      // Preserve the user's colors verbatim — never overwrite with defaults.
      colors: (parsed as Record<string, unknown>).colors,
    } as unknown as GeneratedDesignSystem;
    return merged;
  } catch {
    return null;
  }
}

export function isThemeUrlTooLong(ds: GeneratedDesignSystem): boolean {
  return encodeTheme(ds).length > MAX_THEME_URL_LENGTH;
}
