"use client";

import { useFormStatus } from "react-dom";
import { btnPrimary } from "@/components/styles";

// A submit button that shows a spinner and disables itself while the form is sending.
export function SubmitButton({
  children,
  pendingText = "Please wait...",
  className = btnPrimary,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            d="M4 12a8 8 0 018-8"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="opacity-75"
          />
        </svg>
      )}
      {pending ? pendingText : children}
    </button>
  );
}
