import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  Dumbbell,
  Footprints,
  Infinity as InfinityIcon,
  Landmark,
  Share2,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from "lucide-react";

const journey = [
  {
    title: "Choose four core gyms",
    description:
      "Build your core set from participating gyms for the membership period. You can choose a new eligible set next period.",
    Icon: Building2,
  },
  {
    title: "Pick Basic or Classic",
    description:
      "Choose ten included check-ins for €80 or unlimited included check-ins for €150. Both follow the same daily rule.",
    Icon: WalletCards,
  },
  {
    title: "Check in at a core gym",
    description:
      "Gym staff confirm your presence. An included visit counts once and never becomes public automatically.",
    Icon: Footprints,
  },
  {
    title: "Go beyond your four",
    description:
      "At an eligible participating non-core gym, an active member can pay the illustrative €15 member price directly to that gym.",
    Icon: CircleDollarSign,
  },
  {
    title: "See transparent usage",
    description:
      "Included check-ins contribute to a visible provisional gym allocation. It is not presented as a final or claimable payout.",
    Icon: Landmark,
  },
  {
    title: "Share only if you want",
    description:
      "A verified check-in stays private unless you explicitly share it with people who follow you.",
    Icon: Share2,
  },
] as const;

const memberBenefits = [
  "Four chosen gyms in one membership",
  "Clear allowances and one daily rule",
  "A €15 option at eligible gyms beyond your four",
  "Private-by-default check-ins with optional sharing",
] as const;

const gymBenefits = [
  "Discovery inside a participating network",
  "Staff-confirmed evidence of real member visits",
  "Transparent provisional allocation inputs",
  "Direct payment for eligible non-core visits",
] as const;

export function HowItWorksScreen() {
  return (
    <div className="how-it-works product-guide">
      <section className="hiw-hero" aria-labelledby="guide-title">
        <div className="hiw-hero-copy">
          <span className="eyebrow">ONE MEMBERSHIP · FOUR CORE GYMS</span>
          <h1 id="guide-title">
            More places to train. One clear membership<span>.</span>
          </h1>
          <p>
            Choose four participating gyms, select the plan that fits your
            rhythm and use verified check-ins to keep access and gym allocation
            understandable.
          </p>
          <div className="discovery-links">
            <Link className="button lime" href="/explore">
              Explore participating gyms
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button hiw-outline-button" href="/coming-soon">
              Join the waitlist <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <small>
            Concept preview · No live membership, payment or partnership claim
          </small>
        </div>
        <aside className="hiw-product-card" aria-label="Membership summary">
          <span className="eyebrow">THE PRODUCT AT A GLANCE</span>
          <strong>1 membership</strong>
          <div className="hiw-product-stat">
            <span>4</span>
            <p>
              core gyms
              <small>selected for each period</small>
            </p>
          </div>
          <div className="hiw-product-stat">
            <span>2</span>
            <p>
              plan options
              <small>Basic or Classic</small>
            </p>
          </div>
          <p className="hiw-product-note">
            One included check-in per venue-local day on either plan.
          </p>
        </aside>
      </section>

      <section className="hiw-section" aria-labelledby="plans-heading">
        <div className="hiw-section-heading">
          <span className="eyebrow">CHOOSE YOUR PLAN</span>
          <h2 id="plans-heading">Two plans. The same four-gym freedom.</h2>
          <p>
            These are illustrative monthly demo prices, not final commercial
            offers. Both plans use the same selected core gyms and daily rule.
          </p>
        </div>
        <div className="hiw-plan-grid">
          <article className="hiw-plan-card basic">
            <div className="hiw-plan-header">
              <div>
                <span className="eyebrow">BASIC</span>
                <h3>For a flexible routine</h3>
              </div>
              <p>
                <strong>€80</strong>
                <small>demo month</small>
              </p>
            </div>
            <div className="hiw-allowance">
              <strong>10</strong>
              <span>included check-ins per membership period</span>
            </div>
            <ul>
              <li>
                <Check size={16} aria-hidden="true" /> Across your four core
                gyms
              </li>
              <li>
                <Check size={16} aria-hidden="true" /> At most one included
                check-in per day
              </li>
            </ul>
          </article>
          <article className="hiw-plan-card classic">
            <div className="hiw-plan-header">
              <div>
                <span className="eyebrow">CLASSIC</span>
                <h3>For a frequent routine</h3>
              </div>
              <p>
                <strong>€150</strong>
                <small>demo month</small>
              </p>
            </div>
            <div className="hiw-allowance">
              <InfinityIcon size={43} aria-hidden="true" />
              <span>unlimited included check-ins; no numerical allowance</span>
            </div>
            <ul>
              <li>
                <Check size={16} aria-hidden="true" /> Across your four core
                gyms
              </li>
              <li>
                <Check size={16} aria-hidden="true" /> At most one included
                check-in per day
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section
        className="hiw-section hiw-journey"
        aria-labelledby="journey-heading"
      >
        <div className="hiw-section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2 id="journey-heading">From choosing gyms to showing up.</h2>
          <p>
            Core visits, visits beyond your four and social sharing stay
            separate so members and gyms can see exactly what happened.
          </p>
        </div>
        <ol className="hiw-journey-grid">
          {journey.map(({ title, description, Icon }, index) => (
            <li key={title}>
              <div className="hiw-step-topline">
                <span>0{index + 1}</span>
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hiw-non-core" aria-labelledby="non-core-heading">
        <div className="hiw-non-core-price" aria-hidden="true">
          <span>€</span>15
        </div>
        <div>
          <span className="eyebrow">A FIFTH GYM, WHEN YOU NEED IT</span>
          <h2 id="non-core-heading">Your network extends beyond your four.</h2>
          <p>
            An active member may visit an eligible participating gym outside
            their core set for the illustrative €15 member price. That payment
            goes directly to the destination gym. It does not use a Basic
            check-in and does not enter the membership allocation pool.
          </p>
          <small>
            Separate eligibility, capacity and verified payment are required in
            the target product. This preview does not take payment.
          </small>
        </div>
      </section>

      <section className="hiw-section" aria-labelledby="value-heading">
        <div className="hiw-section-heading">
          <span className="eyebrow">TWO SIDES · ONE PRODUCT</span>
          <h2 id="value-heading">
            Useful for members. Understandable for gyms.
          </h2>
        </div>
        <div className="hiw-value-grid">
          <article className="hiw-value-card members">
            <UsersRound size={27} aria-hidden="true" />
            <span className="eyebrow">FOR MEMBERS</span>
            <h3>Build a routine around real choice.</h3>
            <ul>
              {memberBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={15} aria-hidden="true" /> {benefit}
                </li>
              ))}
            </ul>
          </article>
          <article className="hiw-value-card gyms">
            <Dumbbell size={27} aria-hidden="true" />
            <span className="eyebrow">FOR FITNESS BUSINESSES</span>
            <h3>Grow through visible, verifiable participation.</h3>
            <ul>
              {gymBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={15} aria-hidden="true" /> {benefit}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="hiw-allocation" aria-labelledby="allocation-heading">
        <div className="hiw-section-heading">
          <span className="eyebrow">TRANSPARENT, NOT OVERPROMISED</span>
          <h2 id="allocation-heading">
            Usage informs a provisional allocation.
          </h2>
          <p>
            Included check-ins provide transparent evidence for a gym&apos;s
            provisional share of the demonstrated membership pool. That figure
            is not a finalized or claimable payout; refunds, unused value,
            reserves, taxes and settlement timing remain unresolved.
          </p>
        </div>
        <div
          className="hiw-allocation-flow"
          aria-label="Provisional allocation flow"
        >
          <div>
            <WalletCards size={21} aria-hidden="true" />
            <span>Membership pool</span>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
          <div>
            <ShieldCheck size={21} aria-hidden="true" />
            <span>Verified core check-ins</span>
          </div>
          <ArrowRight size={20} aria-hidden="true" />
          <div>
            <Landmark size={21} aria-hidden="true" />
            <span>Provisional gym allocation</span>
          </div>
        </div>
      </section>

      <section
        className="hiw-infrastructure"
        aria-labelledby="infrastructure-heading"
      >
        <div>
          <span className="eyebrow">PRODUCT FIRST · DEVNET UNDERNEATH</span>
          <h2 id="infrastructure-heading">Solana supports the demo rails.</h2>
          <p>
            The target demo uses test EURC on Solana Devnet for membership
            activation and eligible €15 non-core payments, with verifiable
            receipts and retry-safe reconciliation. Accounts, discovery,
            permissions and social sharing remain application features.
          </p>
          <small>No real funds · No production or legal claim</small>
        </div>
        <Link href="/coming-soon" className="button lime">
          Follow the build <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
