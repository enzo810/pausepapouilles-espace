import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { auth } from "@/lib/auth";
import { User } from "better-auth";
import { LogOut, User2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "./logo";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between items-center px-4 border-b border-gray-200 sticky top-0 z-50 w-full bg-background">
      <Logo className="w-18" />
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/">Animaux</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/prestations">Prestations</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href="/calendrier">Calendrier</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Avatar className="size-6">
                <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <p>{user.name}</p>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/profile">
                <div className="flex items-center gap-2">
                  <User2 className="size-4" />
                  Profil
                </div>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <form>
                  <button
                    className="flex items-center gap-2 w-full"
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
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    </header>
  );
};
