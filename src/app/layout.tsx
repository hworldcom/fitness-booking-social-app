import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { AuthSessionProvider } from "@/auth/client/session-provider";
import { PreviewShell } from "@/features/preview/preview-shell";
import { verifiedAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: {
    default: "RepX Club — Social fitness, onchain.",
    template: "%s | RepX Club",
  },
  description:
    "Find your people. Discover a place to train. Create a fitness challenge with RepX Club. Hackathon frontend preview.",
  robots: { index: false, follow: false },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSession = await verifiedAuthSession();

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider initialSession={initialSession}>
          <PreviewShell>{children}</PreviewShell>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
