import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Dumbbell, Sparkles } from "lucide-react";
import { WaitlistRequest } from "./waitlist-request";

const previewSteps = [
  "Discover participating gyms",
  "Compare Basic and Classic membership",
  "Choose four core gyms",
  "Share verified participation when you choose",
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
            We&apos;re building one membership for flexible access across four
            selected participating gyms, with a small community layer around
            showing up.
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
            <Dumbbell size={35} />
          </span>
          <strong>FOUR GYMS · ONE MEMBERSHIP</strong>
        </div>
      </section>

      <section className="coming-soon-waitlist" aria-label="Join the waitlist">
        <div className="coming-soon-waitlist-copy">
          <span className="eyebrow">FOLLOW THE BUILD</span>
          <h2>Get an invitation when the complete demo is ready.</h2>
          <p>
            Join the early-access list for product updates, demo availability
            and the first complete multi-gym membership walkthrough.
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
          <h2>The interim gym preview is already open.</h2>
        </div>
        <Link className="button dark" href="/explore">
          Explore MovX <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
