import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Middleware
export async function onboardingMiddleware() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !session.user.name) {
    redirect("/complete-profile");
  }

  if (session && !session.user.emailVerified) {
    redirect(`/verify-email?email=${session.user.email}`);
  }
}
