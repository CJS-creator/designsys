import { GeneratedDesignSystem } from "@/types/designSystem";

/**
 * Encodes a design system as a URL-safe base64 string suitable for use in a hash.
 * Intended for sharing the *exact* state without a server round-trip.
 *
 * Format: base64url(JSON.stringify(ds))
 */
function toBase64Url(input: string): string {
  // Use TextEncoder + btoa fallback path that handles unicode safely.
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export const MAX_THEME_URL_LENGTH = 7000;

export function encodeTheme(ds: GeneratedDesignSystem): string {
  // Strip volatile/server-only fields to keep the payload compact.
  const { id: _id, live_version_id: _live, ...slim } = ds;
  void _id;
  void _live;
  return toBase64Url(JSON.stringify(slim));
}

export function buildThemeUrl(ds: GeneratedDesignSystem, base?: string): string {
  const origin = base ?? (typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "");
  const encoded = encodeTheme(ds);
  return `${origin}#theme=${encoded}`;
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
    const parsed = JSON.parse(json) as GeneratedDesignSystem;
    if (!parsed || typeof parsed !== "object" || !parsed.colors || !parsed.typography) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function isThemeUrlTooLong(ds: GeneratedDesignSystem): boolean {
  return encodeTheme(ds).length > MAX_THEME_URL_LENGTH;
}
