import { cn } from "@/lib/utils";
import Logo from "./logo";

type AuthPageLayoutProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function AuthPageLayout({
  children,
  ...props
}: AuthPageLayoutProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10",
        props.className,
      )}
    >
      <div className="mb-4">
        <Logo className="w-32" />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
