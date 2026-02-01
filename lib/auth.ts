import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin as adminPlugin,
  customSession,
  magicLink,
} from "better-auth/plugins";
import { ADMIN, CLIENT, PET_SITTER } from "./permissions";
import prismaPublic from "./prisma";
import { resend } from "./resend";
import { extendUser } from "./session-manager";

const options = {
  database: prismaAdapter(prismaPublic, {
    provider: "postgresql",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await resend.emails.send({
          to: user.email,
          subject: "Approbation du changement d'email",
          text: `Cliquez sur le lien pour approuver le changement vers ${newEmail} : ${url}`,
          from: "pause-papouilles@enzo-dev.com",
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        to: user.email,
        subject: "Vérifiez votre adresse email",
        text: `Cliquez sur le lien pour vérifier votre email : ${url}`,
        from: "pause-papouilles@enzo-dev.com",
      });
    },
  },
  plugins: [
    adminPlugin({
      defaultRole: "CLIENT",
      roles: {
        CLIENT,
        PET_SITTER,
        ADMIN,
      },
      adminRoles: ["ADMIN", "PET_SITTER"],
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await resend.emails.send({
          to: email,
          subject: "Accédez à votre compte",
          text: `Cliquez pour accéder à votre compte : ${url}?token=${token}`,
          from: "pause-papouilles@enzo-dev.com",
        });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const extendedUser = await extendUser(user.id);
      return {
        ...session,
        user: {
          ...user,
          ...extendedUser,
        },
      };
    }, options),
  ],
});
