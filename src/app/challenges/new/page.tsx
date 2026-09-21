import { CreateChallenge } from "@/features/challenges/challenges";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { protectedPageAccess } from "@/server/authorization/page-access";
export const metadata = { title: "Create a challenge" };
export default async function Page() {
  const access = await protectedPageAccess("/challenges/new");
  if (access.status === "unavailable") {
    return <ProtectedAccessUnavailable />;
  }
  return <CreateChallenge />;
}
