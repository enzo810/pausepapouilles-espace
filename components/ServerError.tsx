import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const ServerError = ({ message }: { message: string | undefined | null }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>
        {message || "Une erreur est survenue"}
      </AlertDescription>
    </Alert>
  );
};

export default ServerError;
