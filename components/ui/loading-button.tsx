"use client";

import * as React from "react";

import { Button, type buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface LoadingButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function LoadingButton({
  disabled,
  loading = false,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || loading} className={cn(className)} {...props}>
      {loading && <Spinner />}
      {children}
    </Button>
  );
}

export { LoadingButton };
