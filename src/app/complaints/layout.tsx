import { Header } from "@/components/Header";
import { containerClass } from "@/components/styles";
import { requireStudent } from "@/lib/auth";

// Wraps every student page with the header. Each page also checks the user itself.
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStudent();

  return (
    <>
      <Header user={user} />
      <main className={`${containerClass} flex-1 py-8 sm:py-12`}>{children}</main>
    </>
  );
}
