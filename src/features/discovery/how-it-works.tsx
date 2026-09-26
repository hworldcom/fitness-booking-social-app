import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Dumbbell,
  UsersRound,
} from "lucide-react";

const focus = [
  {
    title: "Choose one plan",
    description:
      "Compare the Basic and Classic membership options in the upcoming product preview.",
    Icon: Dumbbell,
  },
  {
    title: "Pick four gyms",
    description:
      "Build one core set from participating gyms for the membership period.",
    Icon: Building2,
  },
  {
    title: "Show up together",
    description:
      "Use included gym access and share a verified check-in only when you choose.",
    Icon: UsersRound,
  },
] as const;

export function HowItWorksScreen() {
  return (
    <div className="how-it-works interim-guide">
      <section className="interim-guide-hero" aria-labelledby="guide-title">
        <span className="eyebrow">ONE MULTI-GYM MEMBERSHIP</span>
        <h1 id="guide-title">
          Flexible access across four gyms<span>.</span>
        </h1>
        <p>
          MovX Club is being refocused around one clear product: choose four
          participating gyms, use one membership and stay connected through the
          activity you choose to share.
        </p>
        <div className="discovery-links">
          <Link className="button lime" href="/explore">
            Explore gyms <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="button hiw-ghost-button" href="/coming-soon">
            Join the waitlist <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="interim-guide-section" aria-labelledby="focus-title">
        <div className="hiw-section-heading">
          <span className="eyebrow">CURRENT PRODUCT FOCUS</span>
          <h2 id="focus-title">A smaller, clearer membership experience.</h2>
          <p>
            The detailed plan comparison and activation journey are coming in
            the next frontend slices. Nothing on this page creates paid access.
          </p>
        </div>
        <ol className="interim-guide-grid">
          {focus.map(({ title, description, Icon }, index) => (
            <li key={title}>
              <span className="interim-guide-step">0{index + 1}</span>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="interim-guide-business"
        id="for-clubs"
        aria-labelledby="business-title"
      >
        <div>
          <span className="eyebrow">FOR FITNESS BUSINESSES</span>
          <h2 id="business-title">One network, with visible participation.</h2>
          <p>
            The focused concept gives participating gyms discovery, verified
            usage records and transparent provisional allocation without
            presenting demo economics as a final payout promise.
          </p>
        </div>
        <ul>
          <li>
            <Check size={15} aria-hidden="true" /> Participating-gym discovery
          </li>
          <li>
            <Check size={15} aria-hidden="true" /> Verified member check-ins
          </li>
          <li>
            <Check size={15} aria-hidden="true" /> Transparent provisional usage
          </li>
        </ul>
        <Link href="/clubs/sign-in" className="button secondary">
          Manage a fitness business <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
