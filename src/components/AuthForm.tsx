"use client";

import { useActionState } from "react";
import { adminSignIn, signIn, signUp } from "@/app/actions/auth";
import { Alert } from "@/components/Alert";
import { Field, fieldProps } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { btnPrimary } from "@/components/styles";
import type { FormState } from "@/lib/form-state";

const actions = { login: signIn, signup: signUp, admin: adminSignIn };

// One form for student login, student signup and admin login.
export function AuthForm({ mode }: { mode: "login" | "signup" | "admin" }) {
  const [state, formAction] = useActionState(actions[mode], {} as FormState);
  const errors = state.fieldErrors ?? {};
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error && <Alert>{state.error}</Alert>}
      {state.success && <Alert variant="success">{state.success}</Alert>}

      {isSignup && (
        <Field label="Full name" name="fullName" error={errors.fullName?.[0]}>
          <input
            {...fieldProps("fullName", errors.fullName?.[0])}
            type="text"
            autoComplete="name"
            defaultValue={state.values?.fullName}
          />
        </Field>
      )}

      <Field label="Email" name="email" error={errors.email?.[0]}>
        <input
          {...fieldProps("email", errors.email?.[0])}
          type="email"
          autoComplete="email"
          placeholder="you@campus.edu"
          defaultValue={state.values?.email}
        />
      </Field>

      <Field
        label="Password"
        name="password"
        error={errors.password?.[0]}
        hint={isSignup ? "At least 8 characters." : undefined}
      >
        <input
          {...fieldProps("password", errors.password?.[0])}
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </Field>

      <SubmitButton
        className={`${btnPrimary} w-full`}
        pendingText={isSignup ? "Creating account..." : "Logging in..."}
      >
        {isSignup ? "Create account" : "Log in"}
      </SubmitButton>
    </form>
  );
}
