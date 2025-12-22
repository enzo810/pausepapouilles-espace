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
    <Card>
      <CardHeader>
        <CardTitle>Important : Vérifiez votre email</CardTitle>
        {email ? (
          <CardDescription>
            Nous vous avons envoyé un email de vérification à {email}. Veuillez
            vérifier votre email et cliquer sur le lien pour vérifier votre
            compte.
          </CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
}
