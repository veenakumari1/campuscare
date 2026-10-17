import { statusLabel } from "@/lib/constants";

const colors: Record<string, string> = {
  pending: "bg-[#c8805a]/20 text-[#9a3516]",
  in_progress: "bg-[#e1a581]/45 text-[#5a2e1c]",
  resolved: "bg-[#2a1a16] text-[#3a2e28]",
  rejected: "bg-[#7b4f46]/15 text-[#7b4f46]",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status] ?? "bg-[#2a1a16]/10 text-[#2a1a16]"
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
