import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { btnGhost, btnPrimary, containerClass } from "@/components/styles";

type HeaderProps = {
  user?: { fullName: string; role: "student" | "admin" } | null;
};

// Floating pill navigation. Pass `user` on signed-in pages; leave it out on public pages.
export function Header({ user }: HeaderProps) {
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-3 z-30 pt-3">
      <div className={containerClass}>
        <div className="glass-strong flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[2rem] py-2 pl-3 pr-2.5 sm:rounded-full sm:pl-4">
          <Link
            href={isAdmin ? "/admin/dashboard" : "/"}
            className="flex items-center gap-2.5 rounded-full text-[#3a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8805a]"
          >
            <Image
              src="/brand/mascot.png"
              alt=""
              width={457}
              height={622}
              priority
              className="h-9 w-auto drop-shadow-[0_4px_6px_rgba(14,5,8,0.4)]"
            />
            <span className="text-xl font-semibold tracking-tight">
              CampusCare
            </span>
            {isAdmin && (
              <span className="rounded-full bg-[#c8805a] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#2a1a16]">
                Admin
              </span>
            )}
          </Link>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {!user && (
              <>
                <Link href="/login" className={btnGhost}>
                  Log in
                </Link>
                <Link href="/signup" className={btnPrimary}>
                  Sign up
                </Link>
              </>
            )}

            {user && !isAdmin && (
              <>
                <Link href="/complaints" className={btnGhost}>
                  My complaints
                </Link>
                <Link href="/complaints/new" className={btnGhost}>
                  New complaint
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="hidden px-2 text-sm text-[#3a2e28]/70 md:inline">
                  {user.fullName || "Signed in"}
                </span>
                <form action={signOut}>
                  <input type="hidden" name="to" value={isAdmin ? "admin" : "student"} />
                  <SubmitButton className={btnGhost} pendingText="Signing out...">
                    Sign out
                  </SubmitButton>
                </form>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
