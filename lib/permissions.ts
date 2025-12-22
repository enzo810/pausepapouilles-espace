import { createAccessControl } from "better-auth/plugins";
import { defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

const ac = createAccessControl(statement);

const CLIENT = ac.newRole({
  user: [],
});

const PET_SITTER = ac.newRole({
  user: ["list"],
});

export { CLIENT, PET_SITTER };
