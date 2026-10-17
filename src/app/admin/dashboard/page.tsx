import Link from "next/link";
import { Alert } from "@/components/Alert";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Header } from "@/components/Header";
import { StatusSelect } from "@/components/StatusSelect";
import {
  cardClass,
  containerClass,
  displayHeading,
  eyebrow,
} from "@/components/styles";
import { CATEGORIES, STATUSES, categoryLabel } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AdminComplaint } from "@/lib/types";

export const metadata = { title: "Admin dashboard | CampusCare" };

const LIMIT = 200;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; category?: string }>;
}) {
  // Verifies the user is signed in AND has the admin role.
  const admin = await requireAdmin();
  const { status, q = "", category } = await searchParams;
  const catFilter = CATEGORIES.find((c) => c.value === category)?.value;
  const query = q.trim().toLowerCase();
  const filter = STATUSES.find((s) => s.value === status)?.value;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("complaints")
    .select(
      "id, title, category, description, status, created_at, admin_note, profiles(full_name, email)",
    )
    .order("created_at", { ascending: false })
    .limit(LIMIT);

  const fetched = (data ?? []) as unknown as AdminComplaint[];
  // Search + category apply to everything (so the status counts stay accurate).
  const all = fetched.filter((c) => {
    if (catFilter && c.category !== catFilter) return false;
    if (!query) return true;
    const hay = [
      c.title,
      c.description,
      c.id.slice(0, 8),
      categoryLabel(c.category),
      c.profiles?.full_name,
      c.profiles?.email,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  });
  const visible = filter ? all.filter((c) => c.status === filter) : all;
  const hasFilters = Boolean(query || catFilter);

  const href = (statusValue?: string) => {
    const p = new URLSearchParams();
    if (statusValue) p.set("status", statusValue);
    if (q.trim()) p.set("q", q.trim());
    if (catFilter) p.set("category", catFilter);
    const qs = p.toString();
    return qs ? `/admin/dashboard?${qs}` : "/admin/dashboard";
  };
  const count = (value?: string) =>
    value ? all.filter((c) => c.status === value).length : all.length;

  const tabs = [
    { label: "All", value: undefined, href: href() },
    ...STATUSES.map((s) => ({
      label: s.label,
      value: s.value as string | undefined,
      href: href(s.value),
    })),
  ];

  return (
    <>
      <Header user={admin} />
      <main className={`${containerClass} flex-1 space-y-8 py-8 sm:py-12`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={eyebrow}>Admin</p>
            <h1
              className={`${displayHeading} mt-3 text-4xl font-light text-[#3a2e28] sm:text-5xl`}
            >
              Complaints
            </h1>
          </div>
        </div>

        {/* Search + category filter (plain GET form, no JavaScript needed) */}
        <form
          action="/admin/dashboard"
          className="glass flex flex-col gap-2 rounded-[2rem] p-2 sm:flex-row"
        >
          {filter && <input type="hidden" name="status" value={filter} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search title, student name, email or ID..."
            aria-label="Search complaints"
            className="min-w-0 flex-1 rounded-full border border-[#fffffd]/60 bg-[#fffffd]/70 px-5 py-2.5 text-sm text-[#2a1a16] placeholder:text-[#2a1a16]/45 focus:outline-none focus:ring-2 focus:ring-[#c8805a]/40"
          />
          <select
            name="category"
            defaultValue={catFilter ?? ""}
            aria-label="Filter by category"
            className="rounded-full border border-[#fffffd]/60 bg-[#fffffd]/70 px-4 py-2.5 text-sm text-[#2a1a16] focus:outline-none focus:ring-2 focus:ring-[#c8805a]/40"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-[#2a1a16] px-6 py-2.5 text-sm font-semibold text-[#fffffd] transition-colors hover:bg-[#3a2e28]"
          >
            Search
          </button>
          {hasFilters && (
            <Link
              href="/admin/dashboard"
              className="rounded-full px-4 py-2.5 text-center text-sm font-medium text-[#3a2e28] hover:bg-[#fffffd]/50"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Status summary strip: doubles as the status filter */}
        <nav
          aria-label="Filter by status"
          className="glass-strong grid grid-cols-2 gap-2 rounded-[2rem] p-2 sm:grid-cols-5"
        >
          {tabs.map((tab) => {
            const active = tab.value === filter;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col rounded-[1.5rem] px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8805a] ${
                  active
                    ? "bg-[#fffffd] text-[#2a1a16]"
                    : "text-[#3a2e28] hover:bg-[#fffffd]/10"
                }`}
              >
                <span
                  className={`${displayHeading} text-3xl font-light leading-none`}
                >
                  {count(tab.value)}
                </span>
                <span
                  className={`mt-1.5 text-xs font-medium tracking-wide ${
                    active ? "text-[#2a1a16]/75" : "text-[#3a2e28]/65"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {error && (
          <Alert>We couldn&apos;t load complaints. Please refresh the page.</Alert>
        )}

        {!error && visible.length === 0 && (
          <div className="glass rounded-[2rem] p-3">
            <div className={`${cardClass} text-center text-[#2a1a16]/80`}>
              No complaints to show here.
            </div>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {visible.map((complaint) => (
            <div key={complaint.id} className="glass rounded-[1.75rem] p-2.5">
              <ComplaintCard
                complaint={complaint}
                studentName={
                  complaint.profiles?.full_name ||
                  complaint.profiles?.email ||
                  "Unknown student"
                }
              >
                <StatusSelect
                  complaintId={complaint.id}
                  status={complaint.status}
                  adminNote={complaint.admin_note}
                />
              </ComplaintCard>
            </div>
          ))}
        </div>

        {all.length === LIMIT && (
          <p className="text-center text-sm text-[#3a2e28]/60">
            Showing the {LIMIT} most recent complaints.
          </p>
        )}
      </main>
    </>
  );
}
