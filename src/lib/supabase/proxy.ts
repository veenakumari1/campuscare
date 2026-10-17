import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { readSupabaseEnv } from "@/lib/env";

// Pages that need a signed-in user, and where to send visitors who aren't.
// This is a quick first check. The pages themselves also verify the user and role.
const PROTECTED = [
  { prefix: "/admin/dashboard", loginPath: "/admin/login" },
  { prefix: "/complaints", loginPath: "/login" },
];

export async function updateSession(request: NextRequest) {
  const env = readSupabaseEnv();
  // No settings yet: let the request through. Pages show a clear setup error.
  if (!env) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Also refreshes the session cookie when it is about to expire.
  let signedIn = false;
  try {
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    signedIn = false;
  }

  const path = request.nextUrl.pathname;
  const rule = PROTECTED.find(
    (r) => path === r.prefix || path.startsWith(`${r.prefix}/`),
  );

  if (rule && !signedIn) {
    const url = request.nextUrl.clone();
    url.pathname = rule.loginPath;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
