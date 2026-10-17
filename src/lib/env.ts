// Reads the Supabase settings from .env.local.

export function readSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function requireSupabaseEnv() {
  const env = readSupabaseEnv();
  if (!env) {
    throw new Error(
      "Missing Supabase settings. Copy .env.example to .env.local, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart `npm run dev`.",
    );
  }
  return env;
}
