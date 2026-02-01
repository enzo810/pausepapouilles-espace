import { NotDefined } from "./not-defined";

export function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const displayValue =
    value === null || value === undefined || value === "" ? (
      <NotDefined />
    ) : (
      value
    );

  return (
    <div className="flex items-start gap-3 py-3 px-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      {Icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <div className="font-medium mt-0.5 text-sm">{displayValue}</div>
      </div>
    </div>
  );
}
