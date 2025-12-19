import AuthPageLayout from "@/components/auth-page-layout";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthPageLayout>{children}</AuthPageLayout>;
}
