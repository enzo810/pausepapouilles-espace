import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";

export const actionClient = createSafeActionClient();

class ActionError extends Error {}

export const publicAction = createSafeActionClient();

export const authAction = publicAction.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new ActionError(
      "Vous devez être authentifié pour effectuer cette action.",
    );
  }

  if (!session.user.id) {
    throw new ActionError("La session n'est pas valide.");
  }

  return next({ ctx: { session, ActionError } });
});
