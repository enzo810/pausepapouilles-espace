import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "./auth";
import prisma from "./prisma";

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

export const petSitterAction = authAction.use(async ({ next, ctx }) => {
  const session = ctx.session;
  const userId = session.user.id;
  const role = session.user.role;

  if (!userId) {
    throw new ActionError("La session n'est pas valide.");
  }
  const prismaPetSitter = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!prismaPetSitter) {
    throw new ActionError("Utilisateur introuvable.");
  }

  if (
    !["ADMIN", "PET_SITTER"].includes(prismaPetSitter.role) ||
    !["ADMIN", "PET_SITTER"].includes(role)
  ) {
    throw new ActionError(
      "Vous n'avez pas les droits pour effectuer cette action.",
    );
  }

  return next({ ctx: { session, ActionError } });
});

export const adminAction = authAction.use(async ({ next, ctx }) => {
  const session = ctx.session;
  const userId = session.user.id;
  const role = session.user.role;

  if (!userId) {
    throw new ActionError("La session n'est pas valide.");
  }
  const prismaAdmin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!prismaAdmin) {
    throw new ActionError("Utilisateur introuvable.");
  }

  if (prismaAdmin.role !== "ADMIN" || role !== "ADMIN") {
    throw new ActionError(
      "Vous n'avez pas les droits pour effectuer cette action.",
    );
  }

  return next({ ctx: { session, ActionError } });
});
