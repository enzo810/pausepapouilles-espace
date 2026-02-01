import {
  adminClient,
  customSessionClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, ADMIN, CLIENT, PET_SITTER } from "./permissions";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac: ac,
      roles: {
        CLIENT,
        PET_SITTER,
        ADMIN,
      },
    }),
    magicLinkClient(),
    customSessionClient<typeof auth>(),
  ],
});
export type User = typeof authClient.$Infer.Session.user;
export const { useSession, signIn, signUp, signOut } = authClient;
