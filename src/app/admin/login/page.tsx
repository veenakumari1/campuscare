import Link from "next/link";
import { Alert } from "@/components/Alert";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Admin log in | CampusCare" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthCard
      title="Admin log in"
      subtitle="For authorised campus staff only."
      footer={
        <Link href="/login" className="font-semibold text-[#c8805a] underline-offset-4 hover:underline">
          Student? Log in here
        </Link>
      }
    >
      <div className="space-y-4">
        {error === "not-admin" && (
          <Alert>This account does not have admin access.</Alert>
        )}
        <AuthForm mode="admin" />
      </div>
    </AuthCard>
  );
}
