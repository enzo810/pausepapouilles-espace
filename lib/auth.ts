import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin, customSession } from "better-auth/plugins";
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
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        from: "noreply@enzo-dev.com",
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
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
