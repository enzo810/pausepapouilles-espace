"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/assets/logo.png"
      className={cn("pointer-events-none h-auto select-none", className)}
      width={100}
      height={100}
      priority={true}
      alt={"Logo"}
    />
  );
}
