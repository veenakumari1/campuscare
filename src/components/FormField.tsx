import { inputClass } from "@/components/styles";

// Props to spread onto an <input>, <select> or <textarea> so errors are announced.
export function fieldProps(name: string, error?: string) {
  return {
    id: name,
    name,
    className: inputClass,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  } as const;
}

// A label, the input (children), an optional hint, and the error message.
export function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-[#2a1a16]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#2a1a16]/60">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
