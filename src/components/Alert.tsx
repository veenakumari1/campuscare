export function Alert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success";
  children: React.ReactNode;
}) {
  const color =
    variant === "error"
      ? "border-red-300 bg-red-50 text-red-800"
      : "border-emerald-300 bg-emerald-50 text-emerald-900";

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-2xl border px-4 py-3 text-sm ${color}`}
    >
      {children}
    </div>
  );
}
