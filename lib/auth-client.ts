import { adminClient, customSessionClient } from "better-auth/client/plugins";
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
    customSessionClient<typeof auth>(),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;
