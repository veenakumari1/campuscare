import { StatusBadge } from "@/components/StatusBadge";
import { cardClass } from "@/components/styles";
import { categoryLabel } from "@/lib/constants";
import type { Complaint } from "@/lib/types";

// Shows one complaint. Admins pass extra controls as children and the student's name.
export function ComplaintCard({
  complaint,
  studentName,
  showProgress,
  children,
}: {
  complaint: Complaint;
  studentName?: string;
  showProgress?: boolean;
  children?: React.ReactNode;
}) {
  const date = new Date(complaint.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-[#2a1a16]">
          {complaint.title}
        </h2>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="mt-1 text-xs text-[#2a1a16]/60">
        {categoryLabel(complaint.category)} &middot; {date} &middot; #
        {complaint.id.slice(0, 8).toUpperCase()}
        {studentName ? ` · ${studentName}` : ""}
      </p>

      <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-[#2a1a16]/85">
        {complaint.description}
      </p>

      {complaint.admin_note && (
        <div className="mt-4 rounded-2xl bg-[#c8805a]/10 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c8805a]">
            Admin reply
          </p>
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-[#2a1a16]/90">
            {complaint.admin_note}
          </p>
        </div>
      )}

      {showProgress && <ProgressTrack status={complaint.status} />}

      {children && (
        <div className="mt-4 border-t border-[#2a1a16]/10 pt-4">{children}</div>
      )}
    </article>
  );
}

// Visual-only progress strip derived from the existing status value.
function ProgressTrack({ status }: { status: string }) {
  const rejected = status === "rejected";
  const stages = ["Pending", "In progress", rejected ? "Rejected" : "Resolved"];
  const current = status === "pending" ? 0 : status === "in_progress" ? 1 : 2;

  return (
    <ol
      aria-label="Complaint progress"
      className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-semibold uppercase tracking-wider"
    >
      {stages.map((label, i) => {
        const done = i <= current;
        const bar = !done
          ? "bg-[#2a1a16]/10"
          : rejected && i === 2
            ? "bg-[#7b4f46]"
            : i === 2
              ? "bg-[#2a1a16]"
              : "bg-[#c8805a]";
        return (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className={done ? "text-[#2a1a16]" : "text-[#2a1a16]/40"}
          >
            <span className={`mb-1.5 block h-1.5 rounded-full ${bar}`} />
            {label}
          </li>
        );
      })}
    </ol>
  );
}
