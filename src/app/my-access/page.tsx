import { ProtectedAccessUnavailable } from "@/features/auth/protected-access";
import { MyAccess } from "@/features/access/my-access";
import { protectedPageAccess } from "@/server/authorization/page-access";

export const metadata = { title: "My Access" };

export default async function Page() {
  const access = await protectedPageAccess("/my-access");
  if (access.status === "unavailable") return <ProtectedAccessUnavailable />;
  return <MyAccess preview={access.status === "preview"} />;
}
