"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validation";
import type { FormState } from "@/lib/form-state";

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

// Turn Supabase's technical messages into friendly ones.
function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Incorrect email or password.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email first. Check your inbox for the confirmation link.";
  if (m.includes("already registered"))
    return "An account with this email already exists. Try logging in instead.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password"))
    return "That password isn't accepted. Try a longer, less common one.";
  if (m.includes("fetch") || m.includes("network"))
    return "Can't reach the server. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}

// Shared by the student login and the admin login.
async function logIn(
  formData: FormData,
  expectedRole: "student" | "admin",
): Promise<FormState> {
  const raw = { email: text(formData, "email"), password: text(formData, "password") };
  const values = { email: raw.email };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { error: friendlyAuthError(error?.message ?? ""), values };
  }

  // Check the role on the server before letting the person in.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: "Your profile could not be loaded. Please try again.", values };
  }

  if (profile.role !== expectedRole) {
    await supabase.auth.signOut();
    return {
      error:
        expectedRole === "admin"
          ? "This account does not have admin access."
          : "This is an admin account. Please use the admin login page.",
      values,
    };
  }

  redirect(expectedRole === "admin" ? "/admin/dashboard" : "/complaints");
}

export async function signIn(_prev: FormState, formData: FormData) {
  return logIn(formData, "student");
}

export async function adminSignIn(_prev: FormState, formData: FormData) {
  return logIn(formData, "admin");
}

export async function signUp(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    fullName: text(formData, "fullName"),
    email: text(formData, "email"),
    password: text(formData, "password"),
  };
  const values = { fullName: raw.fullName, email: raw.email };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) return { error: friendlyAuthError(error.message), values };

  // When email confirmation is on, an existing email comes back with no identities.
  if (data.user && data.user.identities?.length === 0) {
    return {
      error: "An account with this email already exists. Try logging in instead.",
      values,
    };
  }

  // Signed in straight away (email confirmation is off in Supabase).
  if (data.session) redirect("/complaints");

  return {
    success:
      "Account created. Check your email to confirm your address, then log in.",
  };
}

export async function signOut(formData: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(text(formData, "to") === "admin" ? "/admin/login" : "/login");
}
