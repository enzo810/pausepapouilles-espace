import ResetPassword from "@/components/reset-password";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement…</div>}>
      <ResetPassword />
    </Suspense>
  );
}
