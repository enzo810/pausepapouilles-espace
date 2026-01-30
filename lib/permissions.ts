import { createAccessControl } from "better-auth/plugins";
import { defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

const CLIENT = ac.newRole({
  user: [],
});

const PET_SITTER = ac.newRole({
  user: ["list"],
});

const ADMIN = ac.newRole({
  user: ["list", "create", "update", "delete"],
});

export { ADMIN, CLIENT, PET_SITTER };
