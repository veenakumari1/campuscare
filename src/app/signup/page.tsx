import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Sign up | CampusCare" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Sign up to start submitting complaints."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#c8805a] underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" />
    </AuthCard>
  );
}
