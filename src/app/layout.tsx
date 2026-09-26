import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import "./club-theme.css";
import "./how-it-works.css";
import "./coming-soon.css";
import { ActorProvider } from "@/auth/client/actor-provider";
import { AuthSessionProvider } from "@/auth/client/session-provider";
import { PreviewShell } from "@/features/preview/preview-shell";
import { initialAuthorizationState } from "@/server/authorization/service";

export const metadata: Metadata = {
  title: {
    default: "MovX Club — Flexible fitness access, built around people.",
    template: "%s | MovX Club",
  },
  description:
    "Preview MovX Club, one multi-gym membership built around flexible access and verified participation.",
  robots: { index: false, follow: false },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session: initialSession, actor: initialActor } =
    await initialAuthorizationState();

  return (
    <html lang="en">
      <body>
        <AuthSessionProvider initialSession={initialSession}>
          <ActorProvider initialActor={initialActor}>
            <PreviewShell>{children}</PreviewShell>
          </ActorProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
