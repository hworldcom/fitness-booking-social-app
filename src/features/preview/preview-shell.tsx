"use client";

import type { ReactNode } from "react";
import { Shell } from "@/components/shell";
import { useDemo } from "./store";

export function PreviewShell({ children }: { children: ReactNode }) {
  const { storageUnavailable } = useDemo();
  return <Shell storageUnavailable={storageUnavailable}>{children}</Shell>;
}
