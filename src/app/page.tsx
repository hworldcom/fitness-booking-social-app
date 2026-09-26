import type { Metadata } from "next";
import { Feed } from "@/features/feed/feed";

export const metadata: Metadata = {
  title: "MovX Club — A membership built around your routine.",
  description:
    "Compare MovX Club Basic and Classic: one membership across your selected core gyms, with optional member-priced visits beyond your core set.",
};

export default function Page() {
  return <Feed />;
}
