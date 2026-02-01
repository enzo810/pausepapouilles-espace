import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyPage(props: {
  searchParams: Promise<Record<string, string>>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Important : Vérifiez votre email</CardTitle>
        {email ? (
          <CardDescription>
            Nous vous avons envoyé un email de vérification à {email}. Veuillez
            cliquer sur le lien pour accéder à votre compte.
          </CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
}
