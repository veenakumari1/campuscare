import Link from "next/link";
import { Alert } from "@/components/Alert";
import { ComplaintCard } from "@/components/ComplaintCard";
import {
  btnPrimary,
  cardClass,
  displayHeading,
  eyebrow,
} from "@/components/styles";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Complaint } from "@/lib/types";

export const metadata = { title: "My complaints | CampusCare" };

const markerColor: Record<string, string> = {
  pending: "bg-[#c8805a]",
  in_progress: "bg-[#e1a581]",
  resolved: "bg-[#fffffd]",
  rejected: "bg-[#fffffd]/35",
};

export default async function MyComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const user = await requireStudent();
  const { submitted } = await searchParams;

  // Row Level Security makes sure this only returns the student's own complaints.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("complaints")
    .select("id, title, category, description, status, created_at, admin_note")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const complaints = (data ?? []) as Complaint[];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Track</p>
          <h1
            className={`${displayHeading} mt-3 text-4xl font-light text-[#3a2e28] sm:text-5xl`}
          >
            My complaints
          </h1>
        </div>
        <Link href="/complaints/new" className={btnPrimary}>
          New complaint
        </Link>
      </div>

      {submitted && (
        <Alert variant="success">
          Your complaint was submitted. You can track its status here.
        </Alert>
      )}

      {error && (
        <Alert>We couldn&apos;t load your complaints. Please refresh the page.</Alert>
      )}

      {!error && complaints.length === 0 && (
        <div className="glass-strong rounded-[2rem] p-3">
          <div className={`${cardClass} text-center`}>
            <p className="text-[#2a1a16]/80">
              You haven&apos;t submitted any complaints yet.
            </p>
            <Link href="/complaints/new" className={`${btnPrimary} mt-4`}>
              Submit your first complaint
            </Link>
          </div>
        </div>
      )}

      {complaints.length > 0 && (
        <ol className="relative space-y-5 border-l border-dashed border-[#fffffd]/35 pl-6 sm:pl-9">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[1.95rem] top-6 h-3.5 w-3.5 rounded-full ring-4 ring-[#e9e1d7] sm:-left-[2.7rem] ${
                  markerColor[complaint.status] ?? "bg-[#fffffd]/40"
                }`}
              />
              <div className="glass rounded-[1.75rem] p-2.5">
                <ComplaintCard complaint={complaint} showProgress />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
