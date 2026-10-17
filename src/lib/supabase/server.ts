import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/env";

// Supabase client for Server Components and Server Actions.
// It acts as the signed-in user, so Row Level Security is always enforced.
export async function createClient() {
  // Read cookies first: this marks the page as "per-request", never prerendered.
  const cookieStore = await cookies();
  const { url, anonKey } = requireSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, which cannot set cookies.
          // This is fine: proxy.ts refreshes the session on every request.
        }
      },
    },
  });
}
