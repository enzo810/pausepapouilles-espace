"use client";

import { UpdateProfile } from "@/components/update-profile";

export default function UserProfilePage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 md:p-10">
      <UpdateProfile className="w-full max-w-sm" />
    </div>
  );
}
