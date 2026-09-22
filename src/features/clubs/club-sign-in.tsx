"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CircleAlert,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "@/auth/client/actor-provider";
import { useAuthSession } from "@/auth/client/session-provider";
import { Pill } from "@/components/ui";
import { ClubWalletAuthorityPanel } from "@/solana/client/club-wallet-authority";
import { fetchClubWallet } from "@/solana/client/club-wallet-client";
import type { ClubWalletSnapshot } from "@/solana/club-wallet";
import {
  CLUB_EMAIL_SIGN_IN_HREF,
  visibleClubEntryState,
  type ClubEntryState,
} from "./club-entry-state";

type ClubResult = Readonly<{
  attempt: number;
  sessionKey: string;
  snapshot: ClubWalletSnapshot;
}>;

export function ClubSignInScreen() {
  const { actor } = useActor();
  const { session } = useAuthSession();
  const sessionKey = session.status === "signed-in" ? session.subject : null;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<ClubResult | null>(null);

  useEffect(() => {
    if (actor.status !== "authorized" || !sessionKey) return;
    let active = true;
    void fetchClubWallet().then((snapshot) => {
      if (active) setResult({ attempt, sessionKey, snapshot });
    });
    return () => {
      active = false;
    };
  }, [actor.status, attempt, sessionKey]);

  const currentSnapshot =
    result?.attempt === attempt && result.sessionKey === sessionKey
      ? result.snapshot
      : null;
  const state = visibleClubEntryState(actor, currentSnapshot);
  const showPersonalContext =
    actor.status === "authorized" &&
    (state.status === "loading" ||
      state.status === "no-club-access" ||
      state.status === "eligible" ||
      state.status === "authorized");

  function retry() {
    if (actor.status === "authorized") {
      setAttempt((value) => value + 1);
    } else {
      window.location.reload();
    }
  }

  function updateSnapshot(snapshot: ClubWalletSnapshot) {
    if (sessionKey) setResult({ attempt, sessionKey, snapshot });
  }

  return (
    <div className="club-entry">
      <section className="club-entry-hero">
        <div>
          <span className="eyebrow">CLUB ACCESS</span>
          <h1>
            Manage your club,
            <br />
            as yourself<span className="lime-text">.</span>
          </h1>
          <p>
            Club administrators use their own MovX Club email account. The
            server then checks prepared club eligibility, while a separate club
            wallet proves short-lived signing authority.
          </p>
          <div className="club-entry-pills" aria-label="Club access boundaries">
            <Pill>Personal email identity</Pill>
            <Pill>Server-derived club access</Pill>
            <Pill>Separate club wallet</Pill>
          </div>
        </div>
        <div className="club-entry-mark" aria-hidden="true">
          <Building2 size={58} strokeWidth={1.2} />
          <span>FOR CLUBS</span>
        </div>
      </section>

      <div className="club-entry-layout">
        <section
          className="club-access-card"
          aria-labelledby="club-access-title"
        >
          <div className="club-access-card-heading">
            <div>
              <span>YOUR ACCESS</span>
              <h2 id="club-access-title">Club management entry</h2>
            </div>
            <ShieldCheck size={26} aria-hidden="true" />
          </div>
          {showPersonalContext && actor.status === "authorized" && (
            <div className="club-personal-context">
              <UserRound size={19} aria-hidden="true" />
              <span>
                Signed in personally as
                <strong>{actor.profile.displayName}</strong>
              </span>
            </div>
          )}
          <ClubAccessStateView
            state={state}
            onRetry={retry}
            onSnapshot={updateSnapshot}
          />
        </section>

        <aside
          className="club-entry-explainer"
          aria-labelledby="club-entry-steps"
        >
          <span className="eyebrow">ONE ACCOUNT, CLEAR AUTHORITY</span>
          <h2 id="club-entry-steps">How club access works</h2>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Sign in as a person</strong>
                <p>
                  Your email session identifies the accountable administrator.
                </p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Check prepared access</strong>
                <p>
                  The server checks active primary-administrator eligibility.
                  You cannot choose or submit a club from the browser.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Prove the club wallet separately</strong>
                <p>
                  A readable message grants bounded club authority. It is not a
                  payment and moves no funds.
                </p>
              </div>
            </li>
          </ol>
          <div className="club-entry-boundary">
            <KeyRound size={18} aria-hidden="true" />
            <p>
              There are no shared club credentials, second accounts or completed
              club dashboards in this MVP.
            </p>
          </div>
          <Link href="/how-it-works#for-clubs" className="text-link">
            Why clubs use MovX Club <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function ClubAccessStateView({
  state,
  onRetry,
  onSnapshot,
}: {
  state: ClubEntryState;
  onRetry: () => void;
  onSnapshot: (snapshot: ClubWalletSnapshot) => void;
}) {
  if (state.status === "eligible" || state.status === "authorized") {
    return (
      <div className="club-access-authority">
        <div className="club-access-summary">
          <BadgeCheck size={21} aria-hidden="true" />
          <div>
            <strong>
              {state.status === "authorized"
                ? `Acting for ${state.club.name}`
                : `Prepared access: ${state.club.name}`}
            </strong>
            <p>
              {state.status === "authorized"
                ? "Your personal session remains active while the separate club authority is bounded by its expiry."
                : "Your email account is eligible. The prepared club wallet still needs its own readable proof."}
            </p>
          </div>
        </div>
        <ClubWalletAuthorityPanel snapshot={state} onSnapshot={onSnapshot} />
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <ClubNotice
        Icon={RefreshCw}
        eyebrow="CHECKING ACCESS"
        title="Confirming your prepared club access…"
        description="Your personal session stays active while the server checks club eligibility."
      />
    );
  }

  if (state.status === "signed-out") {
    return (
      <ClubNotice
        Icon={UserRound}
        eyebrow="PERSONAL SIGN-IN FIRST"
        title="Sign in as the accountable administrator."
        description="Use your existing MovX Club email identity. After sign-in, the server checks whether that person may manage one prepared club."
      >
        <Link href={CLUB_EMAIL_SIGN_IN_HREF} className="button dark">
          Sign in with email <ArrowRight size={16} />
        </Link>
        <Link href="/explore" className="button secondary">
          Continue public browsing
        </Link>
      </ClubNotice>
    );
  }

  if (state.status === "preview") {
    return (
      <ClubNotice
        Icon={Building2}
        eyebrow="FRONTEND PREVIEW"
        title="Club management needs account-backed mode."
        description="This configuration does not assign a demonstration club or administrator. Public discovery remains available without inventing club access."
      >
        <Link href="/explore" className="button dark">
          Explore the public preview
        </Link>
      </ClubNotice>
    );
  }

  if (state.status === "forbidden") {
    return (
      <ClubNotice
        Icon={CircleAlert}
        eyebrow="PROFILE REQUIRED"
        title="Finish your personal profile first."
        description="The email session could not be connected to an enrolled MovX Club profile. No club data or authority was shown."
      >
        <Link
          href={`${CLUB_EMAIL_SIGN_IN_HREF}&reason=forbidden`}
          className="button dark"
        >
          Complete personal profile
        </Link>
      </ClubNotice>
    );
  }

  if (state.status === "no-club-access") {
    return (
      <ClubNotice
        Icon={Building2}
        eyebrow="PERSONAL ACCOUNT ACTIVE"
        title="This account has no prepared club access."
        description="You are still signed in normally. Club names and roles stay private unless the server confirms active primary-administrator access. Self-service club creation and invitations are not available yet."
      >
        <Link href="/profile" className="button dark">
          Return to your profile
        </Link>
        <Link href="/how-it-works#for-clubs" className="button secondary">
          Read about clubs
        </Link>
      </ClubNotice>
    );
  }

  return (
    <ClubNotice
      Icon={CircleAlert}
      eyebrow="ACCESS UNAVAILABLE"
      title="We couldn’t verify club access right now."
      description="No club identity or authority was assumed. Your personal account is unchanged; retry the server check when you’re ready."
    >
      <button type="button" className="button dark" onClick={onRetry}>
        <RefreshCw size={15} /> Retry access check
      </button>
      <Link href="/explore" className="button secondary">
        Continue public browsing
      </Link>
    </ClubNotice>
  );
}

function ClubNotice({
  Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  Icon: typeof Building2;
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="club-access-notice">
      <Icon size={29} strokeWidth={1.5} aria-hidden="true" />
      <span>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {children && <div className="club-access-actions">{children}</div>}
      <div className="club-no-funds">
        <WalletCards size={15} aria-hidden="true" />
        Email sign-in never grants payment authority or available funds.
      </div>
    </div>
  );
}
