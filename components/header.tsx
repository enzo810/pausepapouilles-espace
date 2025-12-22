import { User } from "better-auth";
import { Suspense } from "react";
import Logo from "./logo";
import { Skeleton } from "./ui/skeleton";
import UserMenu from "./UserMenu";

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between items-center px-4 border-b border-gray-200 sticky top-0 z-50 w-full">
      <Logo className="w-18" />
      <Suspense fallback={<Skeleton className="h-10 w-20" />}>
        <UserMenu user={user} />
      </Suspense>
    </header>
  );
};
