"use client";

import { useActionState } from "react";
import { updateComplaintStatus } from "@/app/actions/complaints";
import { SubmitButton } from "@/components/SubmitButton";
import { btnOutline, inputClass } from "@/components/styles";
import { STATUSES } from "@/lib/constants";
import type { FormState } from "@/lib/form-state";

// Admin control: pick a new status, optionally write a reply the student will see, and save.
export function StatusSelect({
  complaintId,
  status,
  adminNote,
}: {
  complaintId: string;
  status: string;
  adminNote?: string | null;
}) {
  const [state, formAction] = useActionState(
    updateComplaintStatus,
    {} as FormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="complaintId" value={complaintId} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label
          htmlFor={`status-${complaintId}`}
          className="text-sm font-medium text-[#2a1a16]"
        >
          Status
        </label>
        <select
          key={status}
          id={`status-${complaintId}`}
          name="status"
          defaultValue={status}
          className={`${inputClass} sm:w-48`}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor={`note-${complaintId}`}
          className="text-sm font-medium text-[#2a1a16]"
        >
          Reply to student <span className="font-normal text-[#2a1a16]/50">(optional)</span>
        </label>
        <textarea
          id={`note-${complaintId}`}
          name="adminNote"
          rows={3}
          maxLength={1000}
          defaultValue={adminNote ?? ""}
          placeholder="e.g. A technician has been assigned and will fix it by tomorrow."
          className={`${inputClass} mt-1.5`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className={btnOutline} pendingText="Saving...">
          Update
        </SubmitButton>
        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="text-sm text-emerald-700">
            {state.success}
          </p>
        )}
      </div>
    </form>
  );
}
