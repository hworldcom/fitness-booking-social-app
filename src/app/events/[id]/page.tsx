import { notFound } from "next/navigation";
import { events } from "@/lib/events";
import { EventDetail, EventDraftDetail } from "@/components/events";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id.startsWith("event-draft-")) return <EventDraftDetail id={id} />;
  const event = events.find((item) => item.id === id);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
