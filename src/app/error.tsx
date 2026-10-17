"use client";

import { btnPrimary } from "@/components/styles";

// Shown if something unexpected breaks (for example, missing Supabase settings).
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="glass-strong max-w-md rounded-[2rem] p-8 text-center">
        <h1 className="text-2xl font-semibold text-[#3a2e28]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[#3a2e28]/75">
          Please try again. If the problem continues, contact campus support.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-left text-xs text-red-800">
            {error.message}
          </p>
        )}
        <button type="button" onClick={reset} className={`${btnPrimary} mt-6`}>
          Try again
        </button>
      </div>
    </main>
  );
}
