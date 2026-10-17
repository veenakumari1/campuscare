import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  btnPrimary,
  btnSecondary,
  containerClass,
  displayHeading,
} from "@/components/styles";
import { CATEGORIES, STATUSES } from "@/lib/constants";

const steps = [
  {
    title: "1. Submit",
    text: "Describe the problem, pick a category, and send it in under a minute.",
  },
  {
    title: "2. Review",
    text: "Campus staff review your complaint and mark it as in progress.",
  },
  {
    title: "3. Track",
    text: "Log in any time to see the latest status of every complaint you sent.",
  },
];

const panel =
  "glass-strong relative flex min-h-[500px] flex-col rounded-[2.25rem] p-5 sm:p-6";

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium ${
        active
          ? "bg-[#fffffd] text-[#2a1a16]"
          : "bg-[#fffffd]/45 text-[#3a2e28]/85 ring-1 ring-inset ring-[#fffffd]/20"
      }`}
    >
      {children}
    </span>
  );
}

// Orange on/off switch, as in the reference's Alarm card.
function Toggle() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-6 w-11 rounded-full bg-[#c8805a]"
    >
      <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
    </span>
  );
}

const homeCategories = CATEGORIES.filter((c) =>
  ["hostel", "library", "transport"].includes(c.value),
);

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-clip">
        <section className={`${containerClass} pb-6 pt-10 sm:pt-16`}>
          <h1
            className={`${displayHeading} max-w-3xl text-4xl leading-[1.1] text-[#3a2e28] sm:text-6xl`}
          >
            Report campus issues.
            <br />
            <span className="text-[#3a2e28]/60">Track every response.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#3a2e28]/70 sm:text-lg">
            CampusCare gives students one simple place to raise complaints and
            see exactly where they stand.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/complaints/new" className={`${btnPrimary} w-full sm:w-auto`}>
              Submit a complaint
            </Link>
            <Link href="/login" className={`${btnSecondary} w-full sm:w-auto`}>
              Student log in
            </Link>
          </div>
        </section>

        {/* Three tall glass panels, centre one larger, like the reference */}
        <section
          className={`${containerClass} grid gap-5 pb-16 pt-8 sm:pb-24 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:items-center`}
        >
          {/* 1. Submit */}
          <div className={panel}>
            <div className="flex items-center gap-2">
              <Pill active>Step 1</Pill>
              <Pill>Step 2</Pill>
            </div>
            <h2 className={`${displayHeading} mt-6 text-center text-3xl text-[#3a2e28]`}>
              Submit
            </h2>
            <div className="relative mx-auto mt-4 h-52 w-full max-w-[250px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 250 200"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path
                  d="M12 190 C12 70 60 14 125 14 C190 14 238 70 238 190"
                  stroke="#fffffd"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />
                <circle cx="180" cy="30" r="7" fill="#fffffd" />
              </svg>
              <Image
                src="/brand/mascot.png"
                alt="CampusCare mascot wearing a graduation cap"
                width={457}
                height={622}
                priority
                className="float-a absolute bottom-0 left-1/2 h-[88%] w-auto -translate-x-1/2 drop-shadow-[0_20px_24px_rgba(14,5,8,0.55)]"
              />
            </div>
            <p className="mt-4 text-center text-5xl font-light text-[#3a2e28]">
              1 min
            </p>
            <p className="mt-1 text-center text-sm text-[#3a2e28]/65">
              {steps[0].text}
            </p>
            <div className="mt-auto flex items-center justify-center gap-3 pt-6" aria-hidden="true">
              {["#fffffd", "#e1a581", "#c8805a", "#a76845", "#511105"].map((c) => (
                <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* 2. Review (centre, larger) */}
          <div className={`${panel} lg:min-h-[580px]`}>
            <div className="flex items-center justify-between">
              <span
                aria-hidden="true"
                className="flex h-9 w-12 flex-col items-center justify-center gap-1 rounded-full bg-[#fffffd]/15 ring-1 ring-inset ring-[#fffffd]/25"
              >
                <span className="h-px w-4 bg-[#3a2e28]" />
                <span className="h-px w-3 bg-[#3a2e28]" />
              </span>
              <span className="flex h-10 w-10 items-end justify-center overflow-hidden rounded-full bg-[#fffffd]/25 ring-1 ring-inset ring-[#fffffd]/40">
                <Image
                  src="/brand/mascot.png"
                  alt=""
                  width={457}
                  height={622}
                  className="h-9 w-auto"
                />
              </span>
            </div>

            <h2 className={`${displayHeading} mt-6 text-3xl text-[#3a2e28]`}>
              Hi there
            </h2>
            <p className="text-sm text-[#3a2e28]/60">Welcome to CampusCare</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {homeCategories.map((c, i) => (
                <Pill key={c.value} active={i === 0}>
                  {c.label}
                </Pill>
              ))}
            </div>

            <div className="glass mt-5 rounded-[1.5rem] p-4">
              <p className="text-sm font-semibold text-[#3a2e28]">{steps[1].title}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#3a2e28]/65">
                {steps[1].text}
              </p>
              <div className="relative mt-4 h-1 rounded-full bg-[#3a2e28]/15">
                <span className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-[#3a2e28]" />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a2e28]" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="paper flex flex-col rounded-[1.5rem] p-4">
                <p className="text-sm font-semibold">Status</p>
                <p className="mt-3 text-2xl font-light leading-tight">In progress</p>
                <p className="text-xs text-[#2a1a16]/55">Staff review</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#2a1a16]/55">On</span>
                  <Toggle />
                </div>
              </div>
              <div className="relative flex flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#ecc9ae] to-[#c8805a] p-4 text-[#3a2e28] ring-1 ring-inset ring-[#fffffd]/20">
                <p className="text-sm font-semibold">{steps[2].title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#3a2e28]/75">
                  Every complaint, one status.
                </p>
                <span className="mt-auto flex h-9 w-9 items-center justify-center self-end rounded-full bg-[#fffffd]/20">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c8805a]" />
                </span>
              </div>
            </div>
          </div>

          {/* 3. Track */}
          <div className={panel}>
            <div className="flex items-center gap-2">
              <Pill active>Pending</Pill>
              <Pill>Resolved</Pill>
            </div>
            <h2 className={`${displayHeading} mt-6 text-center text-3xl text-[#3a2e28]`}>
              Track
            </h2>
            <div className="relative mx-auto mt-6 h-52 w-52">
              <svg
                aria-hidden="true"
                viewBox="0 0 208 208"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <circle
                  cx="104"
                  cy="104"
                  r="100"
                  stroke="#fffffd"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <path
                  d="M18 60 A100 100 0 0 1 150 12"
                  stroke="#c8805a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[#fffffd] text-[#2a1a16] shadow-[0_20px_40px_-18px_rgba(14,5,8,0.8)]">
                <span className="text-xs text-[#2a1a16]/55">Status</span>
                <span className="text-3xl font-light leading-tight">
                  {STATUSES[1].label}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4" aria-hidden="true">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fffffd] text-xl text-[#2a1a16]">
                &minus;
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fffffd] text-xl text-[#2a1a16]">
                +
              </span>
            </div>
            <p className="mt-6 text-sm text-[#3a2e28]/65">{steps[2].text}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              <span className="text-xs text-[#3a2e28]/60">Filter</span>
              <Pill>{STATUSES[0].label}</Pill>
              <Pill>{STATUSES[2].label}</Pill>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-[#3a2e28]/55">
        CampusCare &middot;{" "}
        <Link href="/admin/login" className="underline underline-offset-4 hover:text-[#3a2e28]">
          Staff login
        </Link>
      </footer>
    </>
  );
}
