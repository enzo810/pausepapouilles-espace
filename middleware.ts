import { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/auth-middleware";

export async function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - Les fichiers statiques avec extensions (.png, .jpg, .css, .js, etc.)
     * - Les fichiers Next.js internes (_next)
     * - Le favicon.ico
     */
    "/((?!.+\\.[\\w]+$|_next|favicon\\.ico).*)",
    "/",
  ],
};
