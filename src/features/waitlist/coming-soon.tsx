import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { WaitlistRequest } from "./waitlist-request";

const previewSteps = [
  "Discover fitness businesses and experiences",
  "Choose memberships, passes and event tickets",
  "Use access and connect by showing up",
  "Transfer eligible remaining membership access",
];

export function ComingSoonScreen() {
  return (
    <div className="coming-soon">
      <section className="coming-soon-hero" aria-labelledby="coming-soon-title">
        <div className="coming-soon-copy">
          <span className="eyebrow">MOVX CLUB · COMING SOON</span>
          <h1 id="coming-soon-title">
            Flexible fitness access is getting ready to move.
          </h1>
          <p>
            We&apos;re building one place to discover fitness, get the access
            that fits, show up, and keep eligible memberships useful when plans
            change.
          </p>
          <ul>
            {previewSteps.map((step) => (
              <li key={step}>
                <Check size={14} strokeWidth={3} aria-hidden="true" />
                {step}
              </li>
            ))}
          </ul>
          <div className="coming-soon-status">
            <Sparkles size={17} aria-hidden="true" />
            <span>
              Product preview · Solana Devnet · Test EURC · No real funds
            </span>
          </div>
        </div>

        <div className="coming-soon-orbit" aria-hidden="true">
          <span className="coming-soon-orbit-ring" />
          <span className="coming-soon-orbit-center">
            <RefreshCw size={35} />
          </span>
          <strong>ACCESS THAT MOVES WITH YOU</strong>
        </div>
      </section>

      <section className="coming-soon-waitlist" aria-label="Join the waitlist">
        <div className="coming-soon-waitlist-copy">
          <span className="eyebrow">FOLLOW THE BUILD</span>
          <h2>Get an invitation when the complete demo is ready.</h2>
          <p>
            Join the early-access list for product updates, demo availability
            and the first transferable-membership walkthrough.
          </p>
          <Link href="/how-it-works" className="coming-soon-text-link">
            <ArrowLeft size={15} aria-hidden="true" /> Review how MovX works
          </Link>
        </div>
        <WaitlistRequest />
      </section>

      <section className="coming-soon-return">
        <div>
          <span className="eyebrow">EXPLORE THE CURRENT PREVIEW</span>
          <h2>The discovery experience is already open.</h2>
        </div>
        <Link className="button dark" href="/explore">
          Explore MovX <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
