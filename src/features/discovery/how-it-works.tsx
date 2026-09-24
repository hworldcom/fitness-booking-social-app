import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  CircleDollarSign,
  Compass,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

const journey = [
  {
    number: "01",
    title: "Discover",
    description: "Find local gyms, classes and events.",
    Icon: Compass,
    featured: false,
  },
  {
    number: "02",
    title: "Get access",
    description: "Choose a membership, pass or event ticket.",
    Icon: WalletCards,
    featured: false,
  },
  {
    number: "03",
    title: "Show up",
    description: "Use your access and optionally share participation.",
    Icon: CalendarCheck,
    featured: false,
  },
  {
    number: "04",
    title: "Keep it flexible",
    description: "Transfer eligible remaining access when plans change.",
    Icon: RefreshCw,
    featured: true,
  },
] as const;

const peopleBenefits = [
  "Memberships, passes and events in one place",
  "Transfer eligible access when plans change",
  "Meet people through activities and participation",
  "Community based on actually showing up",
];

const businessBenefits = [
  "Publish memberships, passes and sponsored events",
  "Define transfer eligibility and access rules",
  "Reach new customers through discovery and community",
  "Predictable pricing without hidden MovX surcharges",
];

const rails = [
  { number: "1", title: "Email-first", detail: "Account", Icon: Mail },
  {
    number: "2",
    title: "EURC",
    detail: "Payment",
    Icon: CircleDollarSign,
  },
  {
    number: "3",
    title: "Programmable",
    detail: "Access",
    Icon: ShieldCheck,
  },
  {
    number: "4",
    title: "Verifiable",
    detail: "Transfer",
    Icon: RefreshCw,
  },
] as const;

export function HowItWorksScreen() {
  return (
    <div className="how-it-works how-it-works-redesign">
      <section className="hiw-hero" aria-labelledby="guide-title">
        <div className="hiw-hero-copy">
          <span className="eyebrow">
            FLEXIBLE FITNESS ACCESS · BUILT AROUND PEOPLE
          </span>
          <h1 id="guide-title">
            Fitness access that doesn&apos;t lose <span>its value.</span>
          </h1>
          <p>
            Discover gyms, memberships and events in one place. Use your access,
            connect through the activities you attend, and transfer eligible
            memberships when your plans change.
          </p>
          <div className="discovery-links">
            <Link className="button lime" href="/explore">
              Explore MovX <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button hiw-ghost-button" href="#access-journey">
              See how it works <ArrowDown size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hiw-membership-wrap">
          <article
            className="hiw-membership-card"
            aria-label="Example transferable membership"
          >
            <div className="hiw-membership-head">
              <span>NORTHSIDE STRENGTH</span>
              <strong>3 Month Membership</strong>
            </div>
            <div className="hiw-membership-status">
              <span>
                <Check size={12} strokeWidth={3} aria-hidden="true" />
                TRANSFERABLE
              </span>
              <strong>42 days remaining</strong>
            </div>
            <div
              className="hiw-membership-progress"
              role="progressbar"
              aria-label="Membership time remaining"
              aria-valuemin={0}
              aria-valuemax={90}
              aria-valuenow={42}
            >
              <span />
            </div>
            <strong className="hiw-membership-price">€69 / month</strong>
            <p>Access: strength floor + open gym</p>
            <div className="hiw-membership-transfer">
              <span>Plans changed?</span>
              <strong>
                Transfer remaining access <ArrowRight size={15} />
              </strong>
            </div>
          </article>
          <small>Product concept · Solana Devnet demo</small>
        </div>
      </section>

      <section
        className="hiw-journey"
        id="access-journey"
        aria-labelledby="access-journey-title"
      >
        <div className="hiw-section-heading">
          <span className="eyebrow">THE SIMPLE VERSION</span>
          <h2 id="access-journey-title">From discovery to flexible access.</h2>
          <p>See the full fitness-access journey at a glance.</p>
        </div>
        <ol className="hiw-journey-grid">
          {journey.map(({ number, title, description, Icon, featured }) => (
            <li className={featured ? "featured" : undefined} key={number}>
              <span className="hiw-step-number">{number}</span>
              <span className="hiw-step-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>

        <div className="hiw-transfer" aria-label="Example membership transfer">
          <span className="hiw-transfer-label">THE MEMORABLE MOMENT</span>
          <div className="hiw-transfer-person">
            <strong>Alex</strong>
            <small>42 days remaining</small>
          </div>
          <ArrowRight className="hiw-transfer-arrow" aria-hidden="true" />
          <div className="hiw-transfer-terms">
            <strong className="hiw-transfer-badge">ELIGIBLE TRANSFER</strong>
            <span className="hiw-transfer-fee">
              <CircleDollarSign size={12} aria-hidden="true" />
              Small transfer fee paid to the gym
            </span>
          </div>
          <ArrowRight className="hiw-transfer-arrow" aria-hidden="true" />
          <div className="hiw-transfer-person">
            <strong>Sam</strong>
            <small>receives remaining access</small>
          </div>
        </div>
      </section>

      <section className="hiw-value" aria-labelledby="hiw-value-title">
        <div className="hiw-section-heading">
          <span className="eyebrow">TWO SIDES. ONE PRODUCT.</span>
          <h2 id="hiw-value-title">
            Better for members. Better for businesses.
          </h2>
        </div>
        <div className="hiw-value-grid">
          <article className="hiw-value-card people" id="for-people">
            <span className="hiw-card-label">
              <UserRound size={14} aria-hidden="true" /> FOR PEOPLE
            </span>
            <h3>Your access stays useful.</h3>
            <p>
              Choose what fits today without assuming your plans will never
              change.
            </p>
            <ul>
              {peopleBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </article>

          <article className="hiw-value-card business" id="for-clubs">
            <span className="hiw-card-label">
              <Building2 size={14} aria-hidden="true" /> FOR FITNESS BUSINESSES
            </span>
            <h3>Grow without another transaction tax.</h3>
            <p>
              MovX provides distribution, programmable access and community
              infrastructure without making percentage transaction fees the core
              business model.
            </p>
            <ul>
              {businessBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Link href="/clubs/sign-in" className="hiw-card-link">
              Manage a fitness business <ArrowRight size={15} />
            </Link>
          </article>
        </div>
        <p className="hiw-fee-note">
          MovX platform pricing is separate from payment, network and account
          costs. Every unavoidable cost is shown before approval.
        </p>
      </section>

      <section className="hiw-solana" aria-labelledby="hiw-solana-title">
        <div className="hiw-solana-heading">
          <span className="eyebrow">WEB2 UX. WEB3 RAILS.</span>
          <h2 id="hiw-solana-title">
            Solana stays underneath the fitness experience.
          </h2>
          <p>
            People can browse and create a MovX account without first
            understanding wallets. A wallet is connected only when a
            wallet-backed action needs it.
          </p>
        </div>
        <ol className="hiw-rails">
          {rails.map(({ number, title, detail, Icon }, index) => (
            <li key={number}>
              <div className="hiw-rail-node">
                <span>{number}</span>
                <Icon size={18} aria-hidden="true" />
                <strong>{title}</strong>
                <small>{detail}</small>
              </div>
              {index < rails.length - 1 && (
                <ArrowRight className="hiw-rail-arrow" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
        <p className="hiw-technical-note">
          MovX uses Solana for test-EURC settlement and programmable access
          state. Membership state can be controlled by a Solana program using
          program-derived addresses (PDAs); NFTs are not required.
        </p>
      </section>

      <section className="hiw-demo" aria-labelledby="hiw-demo-title">
        <div>
          <span className="eyebrow">BUILT FOR THE HACKATHON</span>
          <h2 id="hiw-demo-title">Be first to try MovX.</h2>
          <p>
            Discover → Sign in → Connect wallet → Buy access → Use access →
            Transfer an eligible membership
          </p>
          <span className="hiw-demo-status">
            <i /> Solana Devnet · Test EURC · No real funds
          </span>
        </div>
        <div className="hiw-demo-actions">
          <Link className="button dark" href="/coming-soon">
            Join the waitlist <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="hiw-faq" aria-labelledby="hiw-faq-title">
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2 id="hiw-faq-title">Three quick answers.</h2>
        <div className="hiw-faq-grid">
          <details>
            <summary>Do I need a wallet?</summary>
            <p>
              Not to browse or create your account. A wallet enters only for a
              wallet-backed action such as a test-EURC payment or transfer.
            </p>
          </details>
          <details>
            <summary>What can be transferred?</summary>
            <p>
              Eligible remaining membership access, when the fitness business
              allows it and the recipient meets its stated rules.
            </p>
          </details>
          <details>
            <summary>Is this using real money?</summary>
            <p>
              No. The hackathon experience targets Solana Devnet and test EURC,
              so the demonstration does not move real funds.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
