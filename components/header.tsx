import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { User } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LogOut, PawPrint, User2, Users } from "lucide-react";
import { Luckiest_Guy } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { buttonVariants } from "./ui/button";

const luckiestGuy = Luckiest_Guy({ weight: "400", subsets: ["latin"] });

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between items-center px-4 sticky top-0 z-50 w-full py-2 bg-[#f9efe3] border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Logo className="w-[80px]" />
        <h1 className={`text-xl font-bold ${luckiestGuy.className} mt-[15px]`}>
          Pause Papouilles Espace
        </h1>
      </div>
      <nav className="flex items-center gap-2">
        <Link
          href="/animal"
          className={cn(
            buttonVariants({ variant: "outlineNav" }),
            "flex items-center gap-2 outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
        >
          <PawPrint className="size-4" />
          Animaux
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outlineNav" }),
              "flex items-center gap-2 cursor-pointer outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
          >
            <Avatar className="size-6">
              <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile" className="flex items-center gap-2">
                <User2 className="size-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/users" className="flex items-center gap-2">
                <Users className="size-4" />
                Utilisateurs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <form className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2"
                  formAction={async () => {
                    "use server";
                    await auth.api.signOut({
                      headers: await headers(),
                    });
                    redirect("/signin");
                  }}
                >
                  <LogOut className="size-4" />
                  Déconnexion
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};
