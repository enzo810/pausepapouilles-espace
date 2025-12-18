"use client";

import PageLayout from "@/components/page-layout";
import { useSession } from "@/lib/auth-client";

export default function AuthPage() {
  const { data: session } = useSession();

  return (
    <PageLayout>
      <div className="user-profile">
        <h2>User Profile</h2>
        <div>
          <strong>Name:</strong> {session?.user?.name}
        </div>
        <div>
          <strong>Email:</strong> {session?.user?.email}
        </div>
      </div>
    </PageLayout>
  );
}
