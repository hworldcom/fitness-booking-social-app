import { notFound } from "next/navigation";
import { classes } from "@/lib/fixtures";
import { ClassDetail } from "@/features/classes/class-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = classes.find((c) => c.id === id);
  if (!session) notFound();
  return <ClassDetail session={session} />;
}
