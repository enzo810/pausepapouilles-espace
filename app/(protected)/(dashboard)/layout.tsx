import { Header } from "@/components/header";
import PageLayout from "@/components/page-layout";
import { getSession } from "@/lib/auth-server";
import { onboardingMiddleware } from "@/middlewares/onboarding-middleware";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  await onboardingMiddleware();

  return (
    <div>
      {session && <Header user={session.user} />}
      <PageLayout>{children}</PageLayout>
    </div>
  );
}
