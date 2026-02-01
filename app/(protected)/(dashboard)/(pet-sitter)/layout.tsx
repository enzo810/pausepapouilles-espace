import { roleMiddleware } from "@/middlewares/role-middleware";

export default async function PetSitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await roleMiddleware();

  return <>{children}</>;
}
