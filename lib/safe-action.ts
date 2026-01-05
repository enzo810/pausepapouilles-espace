import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";

class ActionError extends Error {}

export const publicAction = createSafeActionClient().use(async ({ next }) => {
  return await next({ ctx: { ActionError } });
});

export const authAction = publicAction.use(async ({ next, ctx }) => {
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
