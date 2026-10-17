import { containerClass } from "@/components/styles";

// Shown by loading.tsx while a page is fetching data.
export function LoadingState() {
  return (
    <div
      className={`${containerClass} space-y-4 py-8`}
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-56 animate-pulse rounded-full bg-[#fffffd]/15" />
      <div className="h-28 animate-pulse rounded-3xl bg-[#fffffd]/10" />
      <div className="h-28 animate-pulse rounded-3xl bg-[#fffffd]/10" />
    </div>
  );
}
