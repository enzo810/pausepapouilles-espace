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
        <CardTitle>Important: Check your email</CardTitle>
        {email ? (
          <CardDescription>
            We&apos;ve sent you a verification email to {email}. Please check
            your email and click the link to verify your account.
          </CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
}
