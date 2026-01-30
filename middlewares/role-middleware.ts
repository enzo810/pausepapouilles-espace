import { auth } from "@/lib/auth";
import { isPetSitter } from "@/server/actions/role.action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Middleware
export async function roleMiddleware() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  const isPetSitterResult = await isPetSitter(user?.id || "");

  if (!isPetSitterResult.data?.isPetSitter) {
    redirect("/");
  }
}
