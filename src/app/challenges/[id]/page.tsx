import { notFound } from "next/navigation";
import { challenges } from "@/features/preview/catalogue";
import { ChallengeDetail, DraftDetail } from "@/features/challenges/challenges";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { protectedPageAccess } from "@/server/authorization/page-access";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = challenges.find((c) => c.id === id);
  if (challenge) return <ChallengeDetail challenge={challenge} />;
  if (/^draft-[a-f0-9-]{36}$/.test(id)) {
    const access = await protectedPageAccess(
      `/challenges/${encodeURIComponent(id)}`,
    );
    if (access.status === "unavailable") {
      return <ProtectedAccessUnavailable />;
    }
    return <DraftDetail id={id} />;
  }
  notFound();
}
