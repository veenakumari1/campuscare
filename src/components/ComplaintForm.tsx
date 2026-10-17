"use client";

import { useActionState } from "react";
import { submitComplaint } from "@/app/actions/complaints";
import { Alert } from "@/components/Alert";
import { Field, fieldProps } from "@/components/FormField";
import { SubmitButton } from "@/components/SubmitButton";
import { CATEGORIES } from "@/lib/constants";
import type { FormState } from "@/lib/form-state";

export function ComplaintForm() {
  const [state, formAction] = useActionState(submitComplaint, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Title" name="title" error={errors.title?.[0]}>
        <input
          {...fieldProps("title", errors.title?.[0])}
          type="text"
          placeholder="e.g. Broken fan in Hostel B, Room 12"
          defaultValue={state.values?.title}
        />
      </Field>

      <Field label="Category" name="category" error={errors.category?.[0]}>
        <select
          {...fieldProps("category", errors.category?.[0])}
          defaultValue={state.values?.category ?? ""}
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Description"
        name="description"
        error={errors.description?.[0]}
        hint="Explain what happened, where, and when (20 to 2000 characters)."
      >
        <textarea
          {...fieldProps("description", errors.description?.[0])}
          rows={6}
          defaultValue={state.values?.description}
        />
      </Field>

      <SubmitButton pendingText="Submitting...">Submit complaint</SubmitButton>
    </form>
  );
}
