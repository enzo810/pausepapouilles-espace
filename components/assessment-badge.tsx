import { Badge } from "@/components/ui/badge";
import { NotDefined } from "@/components/ui/not-defined";
import { Assessment } from "@/generated/prisma/enums";
import { displayAssessmentValues } from "@/lib/utils";

export function AssessmentBadge({
  value,
}: {
  value: Assessment | null | undefined;
}) {
  if (!value) return <NotDefined />;
  const variants: Record<
    "GOOD" | "MIXED" | "DIFFICULT",
    "default" | "secondary" | "destructive"
  > = {
    GOOD: "default",
    MIXED: "secondary",
    DIFFICULT: "destructive",
  };
  return (
    <Badge variant={variants[value]}>{displayAssessmentValues(value)}</Badge>
  );
}
