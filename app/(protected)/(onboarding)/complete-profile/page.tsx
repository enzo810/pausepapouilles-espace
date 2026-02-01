import { CompleteProfile } from "@/components/complete-profile";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const session = await getSession();

  if (session && session.user.emailVerified === false) {
    redirect(`/verify-email?email=${session.user.email}`);
  }

  return <CompleteProfile />;
}
