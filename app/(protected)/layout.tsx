import { Header } from "@/components/header";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <Header user={session.user} />
      {children}
    </div>
  );
}
