import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/lib/types";

// Returns the signed-in user with their role, or null.
// getUser() asks Supabase to verify the session, so it can't be faked with a cookie.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role === "admin" ? "admin" : "student",
  };
});

// Use at the top of student pages and actions.
export async function requireStudent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin/dashboard");
  return user;
}

// Use at the top of admin pages and actions. This is the admin role check.
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "admin") redirect("/admin/login?error=not-admin");
  return user;
}
