/**
 * Thok Bazar runs in one of two modes:
 *
 *  - **demo mode** (no credentials): reads come from the bundled seed data in
 *    `src/lib/seed`. Writes are accepted and echoed back but not persisted.
 *  - **live mode**: reads and writes go to Supabase.
 *
 * Mode is decided purely by whether the two public env vars are present, so
 * `npm run dev` works on a fresh clone with no setup.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export const DATA_MODE: "live" | "demo" = isSupabaseConfigured() ? "live" : "demo";
