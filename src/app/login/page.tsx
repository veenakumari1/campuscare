import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Log in | CampusCare" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Student log in"
      subtitle="Log in to submit and track your complaints."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-semibold text-[#c8805a] underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="login" />
    </AuthCard>
  );
}
