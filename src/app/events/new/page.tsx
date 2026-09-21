import { CreateEvent } from "@/features/events/events";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { protectedPageAccess } from "@/server/authorization/page-access";
export const metadata = { title: "Create event" };
export default async function Page() {
  const access = await protectedPageAccess("/events/new");
  if (access.status === "unavailable") {
    return <ProtectedAccessUnavailable />;
  }
  return <CreateEvent />;
}
