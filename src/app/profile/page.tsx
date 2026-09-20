import { Profile } from "@/features/profile/profile";
import { DraftList } from "@/features/challenges/challenges";
export const metadata = { title: "Your profile" };
export default function Page() {
  return <Profile drafts={<DraftList />} />;
}
