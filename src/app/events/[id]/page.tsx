import { notFound } from "next/navigation";
import { events } from "@/features/preview/catalogue";
import { EventDetail, EventDraftDetail } from "@/features/events/events";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { protectedPageAccess } from "@/server/authorization/page-access";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (/^event-draft-[a-f0-9-]{36}$/.test(id)) {
    const access = await protectedPageAccess(
      `/events/${encodeURIComponent(id)}`,
    );
    if (access.status === "unavailable") {
      return <ProtectedAccessUnavailable />;
    }
    return <EventDraftDetail id={id} />;
  }
  const event = events.find((item) => item.id === id);
  if (!event) notFound();
  return <EventDetail event={event} />;
}
