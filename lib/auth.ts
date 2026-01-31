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
          subject: "Approve email change",
          text: `Click the link to approve the change to ${newEmail}: ${url}`,
          from: "noreply@enzo-dev.com",
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        from: "noreply@enzo-dev.com",
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
          subject: "Access your account",
          text: `Click to access your account: ${url}?token=${token}`,
          from: "noreply@enzo-dev.com",
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
