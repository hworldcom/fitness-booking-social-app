import "server-only";

import { redirect } from "next/navigation";
import { signInHref } from "@/auth/return-to";
import { withAuthorizedActor } from "./service";

export type ProtectedPageAccess = Readonly<{
  status: "preview" | "authorized" | "unavailable";
}>;

export async function protectedPageAccess(
  returnTo: string,
): Promise<ProtectedPageAccess> {
  const result = await withAuthorizedActor(async () => undefined);
  if (result.status === "signed-out") redirect(signInHref(returnTo));
  if (result.status === "forbidden") {
    redirect(`${signInHref(returnTo)}&reason=forbidden`);
  }
  return Object.freeze({ status: result.status });
}
