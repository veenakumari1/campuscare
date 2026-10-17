import Image from "next/image";
import { Header } from "@/components/Header";
import { cardClass, displayHeading } from "@/components/styles";

// Page layout shared by login, signup and admin login.
export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
        <div className="relative w-full max-w-md">
          <Image
            src="/brand/mascot.png"
            alt=""
            width={457}
            height={622}
            className="float-a pointer-events-none absolute -right-3 -top-14 z-10 hidden h-28 w-auto drop-shadow-[0_14px_18px_rgba(14,5,8,0.45)] sm:block"
          />
          <div className="glass-strong rounded-[2rem] p-3">
            <div className={cardClass}>
              <h1 className={`${displayHeading} text-2xl font-light text-[#2a1a16]`}>
                {title}
              </h1>
              <p className="mt-1 text-sm text-[#2a1a16]/70">{subtitle}</p>
              <div className="mt-6">{children}</div>
            </div>
          </div>
          {footer && (
            <p className="mt-5 text-center text-sm text-[#3a2e28]/80">{footer}</p>
          )}
        </div>
      </main>
    </>
  );
}
