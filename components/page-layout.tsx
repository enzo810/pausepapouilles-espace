import { cn } from "@/lib/utils";

type PageLayoutProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PageLayout({ children, ...props }: PageLayoutProps) {
  return (
    <div {...props} className={cn("p-20", props.className)}>
      {children}
    </div>
  );
}
