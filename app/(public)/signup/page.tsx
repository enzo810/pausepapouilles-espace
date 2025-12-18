import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
