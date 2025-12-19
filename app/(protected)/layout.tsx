import { Header } from "@/components/header";
import PageLayout from "@/components/page-layout";
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
  } else if (!session.user.emailVerified) {
    redirect(`/verify-email?email=${session.user.email}`);
  }

  return (
    <div>
      <Header user={session.user} />
      <PageLayout>{children}</PageLayout>
    </div>
  );
}
