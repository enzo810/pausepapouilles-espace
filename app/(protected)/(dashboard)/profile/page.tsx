"use client";

import { UpdateProfile } from "@/components/update-profile";

export default function UserProfilePage() {
  return (
    <div className="flex min-h-[calc(100svh-200px)] w-full items-center justify-center p-6 md:p-10">
      <UpdateProfile className="w-full max-w-sm" />
    </div>
  );
}
