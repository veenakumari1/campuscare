import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// In this version of Next.js, "middleware" is called "proxy".
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all pages except static files and images.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
