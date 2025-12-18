import Link from "next/link";
import { Suspense } from "react";
import SignoutButton from "./signoutButton";
import { Skeleton } from "./ui/skeleton";
import { User } from "better-auth";

export const Header = ({ user }: { user: User }) => {
  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 z-50 w-full h-16">
      <Link href="/">App</Link>
      <Suspense fallback={<Skeleton className="h-10 w-20" />}>
        <SignoutButton user={user} />
      </Suspense>
    </header>
  );
};
