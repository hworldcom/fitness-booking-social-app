import { notFound } from "next/navigation";
import { challenges } from "@/lib/fixtures";
import { ChallengeDetail, DraftDetail } from "@/components/challenges";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challenge = challenges.find((c) => c.id === id);
  if (challenge) return <ChallengeDetail challenge={challenge} />;
  if (/^draft-[a-f0-9-]{36}$/.test(id)) return <DraftDetail id={id} />;
  notFound();
}
