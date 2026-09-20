import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: {
    default: "RepX Club — Social fitness, onchain.",
    template: "%s | RepX Club",
  },
  description:
    "Find your people. Discover a place to train. Create a fitness challenge with RepX Club. Hackathon frontend preview.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
