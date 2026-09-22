import { Profile } from "@/features/profile/profile";
import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { protectedPageAccess } from "@/server/authorization/page-access";
export const metadata = { title: "Your profile" };
export default async function Page() {
  const access = await protectedPageAccess("/profile");
  if (access.status === "unavailable") {
    return <ProtectedAccessUnavailable />;
  }
  return <Profile />;
}
