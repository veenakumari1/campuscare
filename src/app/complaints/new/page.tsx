import Link from "next/link";
import { ComplaintForm } from "@/components/ComplaintForm";
import { cardClass, displayHeading, eyebrow } from "@/components/styles";
import { requireStudent } from "@/lib/auth";

export const metadata = { title: "New complaint | CampusCare" };

export default async function NewComplaintPage() {
  await requireStudent();

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <div className="lg:pt-6">
        <Link
          href="/complaints"
          className="text-sm text-[#3a2e28]/70 underline-offset-4 hover:text-[#3a2e28] hover:underline"
        >
          &larr; Back to my complaints
        </Link>
        <p className={`${eyebrow} mt-6`}>Report</p>
        <h1
          className={`${displayHeading} mt-3 text-4xl font-light leading-tight text-[#3a2e28] sm:text-5xl`}
        >
          Submit a complaint
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-[#3a2e28]/75">
          Give as much detail as you can so staff can act quickly.
        </p>
      </div>

      <div className="glass-strong rounded-[2rem] p-3 sm:p-4">
        <div className={cardClass}>
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
}
