"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode, type FormEvent } from "react";
import {
  Activity,
  Compass,
  Flag,
  UserRound,
  Plus,
  MapPin,
  Search,
  ArrowUpRight,
  Info,
  ArrowRight,
  CircleHelp,
} from "lucide-react";
import { Avatar, Brand, Modal, Pill } from "./ui";
import { AuthStatusLink } from "@/auth/client/auth-status-link";
import {
  WalletConnectionPanel,
  WalletStatusButton,
} from "@/solana/client/wallet-connection";

const navigation = [
  { label: "Feed", href: "/", Icon: Activity },
  { label: "Explore", href: "/explore", Icon: Compass },
  { label: "Challenges", href: "/challenges", Icon: Flag },
  { label: "Profile", href: "/profile", Icon: UserRound },
];
export function Shell({
  children,
  storageUnavailable,
}: {
  children: ReactNode;
  storageUnavailable: boolean;
}) {
  const path = usePathname();
  const router = useRouter();
  const [modal, setModal] = useState<"wallet" | "about" | null>(null);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") || "");
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }
  const active = (href: string) =>
    href === "/"
      ? path === "/"
      : path.startsWith(href) ||
        (href === "/explore" &&
          (path.startsWith("/classes") || path.startsWith("/events")));
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand-home" aria-label="RepX Club home">
          <Brand />
        </Link>
        <div className="sidebar-caption">
          FIND YOUR PEOPLE.
          <br />
          MOVE TOGETHER.
        </div>
        <nav aria-label="Main navigation">
          {navigation.map(({ label, href, Icon }) => (
            <Link
              href={href}
              key={href}
              className={`nav-item ${active(href) ? "active" : ""}`}
              aria-current={active(href) ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{label}</span>
              {active(href) && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>
        <Link href="/challenges/new" className="button lime create-nav">
          <Plus size={18} />
          Create a challenge
        </Link>
        <div className="sidebar-bottom">
          <div className="club-note">
            <span className="little-spark">✳</span>
            <strong>
              A little motivation.
              <br />A lot of community.
            </strong>
            <p>
              Your next chapter starts
              <br />
              with showing up.
            </p>
            <Link href="/explore">
              Find your next session <ArrowUpRight size={16} />
            </Link>
          </div>
          <button className="preview-link" onClick={() => setModal("about")}>
            <Info size={15} />
            About this preview
          </button>
          <Link href="/profile" className="sidebar-profile">
            <Avatar />
            <span>
              <strong>Anna Klein</strong>
              <small>Your demo profile</small>
            </span>
            <ArrowUpRight size={18} />
          </Link>
          <span className="sidebar-tagline">Social fitness, onchain.</span>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <Link href="/" className="mobile-brand" aria-label="RepX Club home">
            <Brand compact />
          </Link>
          <span className="location">
            <MapPin size={16} />
            <span>Berlin, Germany</span>
          </span>
          <form className="global-search" role="search" onSubmit={search}>
            <Search size={17} />
            <input
              name="q"
              aria-label="Search activities, studios and challenges"
              placeholder="Search RepX Club…"
              maxLength={200}
            />
            <kbd>↵</kbd>
          </form>
          <div className="header-right">
            <Link
              href="/search"
              className="mobile-search-link icon-button"
              aria-label="Search RepX Club"
            >
              <Search size={19} />
            </Link>
            <Link href="/how-it-works" className="how-it-works-link">
              <CircleHelp size={17} aria-hidden="true" />
              <span>How it works</span>
            </Link>
            <AuthStatusLink />
            <WalletStatusButton onOpen={() => setModal("wallet")} />
            <Link
              href="/profile"
              className="header-avatar"
              aria-label="Your profile"
            >
              <Avatar small />
            </Link>
          </div>
        </header>
        <div className="demo-strip">
          <span>
            <i /> DEMO WORLD
          </span>
          <p>Meet your club. Explore the experience.</p>
          <button onClick={() => setModal("about")}>
            Fixtures · No real funds <Info size={13} />
          </button>
        </div>
        {storageUnavailable && (
          <div className="storage-warning" role="status">
            Browser storage is unavailable. Your changes will last only until
            this page closes.
          </div>
        )}
        <main id="main-content" className="page-content" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>RepX Club © 2026</span>
          <span>Made for movement. Built around people.</span>
          <Pill>Solana Devnet target · Test EURC</Pill>
        </footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className={active(href) ? "active" : ""}
            aria-current={active(href) ? "page" : undefined}
          >
            <Icon size={21} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      {modal && (
        <Modal
          title={
            modal === "wallet"
              ? "Your club. Your wallet."
              : "A first look at RepX Club."
          }
          onClose={() => setModal(null)}
        >
          {modal === "wallet" ? (
            <WalletConnectionPanel onSignIn={() => setModal(null)} />
          ) : (
            <>
              <p className="dialog-copy">
                Social fitness, onchain. Find your people, discover a place to
                train and make a little progress together.
              </p>
              <div className="notice">
                <strong>Everything here is demonstration data.</strong>
                <p>
                  Try creating a challenge draft or previewing a membership
                  booking. Your changes stay in this browser. Venues, visits,
                  pools and people are fixtures, not live partnerships or real
                  funds.
                </p>
              </div>
              <p className="small-copy">
                The next implementation stages add authenticated accounts, gym
                operations and real test-EURC transactions. Financial policy
                details marked proposed are still being finalized.
              </p>
              <button
                className="button lime full"
                onClick={() => setModal(null)}
              >
                Let’s explore <ArrowRight size={17} />
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
