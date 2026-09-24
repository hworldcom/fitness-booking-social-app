import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Compass,
  Dumbbell,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

export function HowItWorksScreen() {
  return (
    <div className="how-it-works">
      <section className="guide-hero" aria-labelledby="guide-title">
        <div className="guide-hero-copy">
          <span className="eyebrow">
            FLEXIBLE FITNESS ACCESS · BUILT AROUND PEOPLE
          </span>
          <h1 id="guide-title">
            Find how you want to move. Choose access that fits.
          </h1>
          <p>
            MovX Club brings memberships, passes and events into one place, so
            it is easier to discover a fitness community and take part on your
            terms.
          </p>
          <div className="discovery-links">
            <Link className="button lime" href="/explore">
              Explore activities <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button guide-ghost-button" href="#access-journey">
              See how it works
            </Link>
          </div>
        </div>
        <aside className="guide-hero-summary" aria-label="MovX Club in brief">
          <span>ONE PLACE TO</span>
          <strong>Discover</strong>
          <strong>Choose</strong>
          <strong>Show up</strong>
          <p>Access first. Community follows.</p>
        </aside>
      </section>

      <nav className="guide-audiences" aria-label="Choose your MovX Club guide">
        <Link href="#for-people" className="guide-audience people">
          <UserRound size={27} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <small>FOR PEOPLE</small>
            <strong>Find flexible access</strong>
            <p>Compare ways to join, then choose what fits your routine.</p>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Link href="#for-clubs" className="guide-audience clubs">
          <Building2 size={27} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <small>FOR FITNESS BUSINESSES</small>
            <strong>Offer access people can use</strong>
            <p>Publish clear options, welcome newcomers and fill activities.</p>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </nav>

      <section
        className="guide-journey"
        id="access-journey"
        aria-labelledby="access-journey-title"
      >
        <div className="guide-section-heading">
          <span className="eyebrow">THE SIMPLE VERSION</span>
          <h2 id="access-journey-title">From discovery to showing up.</h2>
          <p>
            Start with the activity. Pick the access option that makes sense for
            you. The product should make that choice easy to understand.
          </p>
        </div>
        <ol className="guide-journey-steps">
          <li>
            <span className="guide-step-number">01</span>
            <Compass size={22} aria-hidden="true" />
            <h3>Discover</h3>
            <p>
              Browse places, activities and events without needing an account.
            </p>
          </li>
          <li>
            <span className="guide-step-number">02</span>
            <WalletCards size={22} aria-hidden="true" />
            <h3>Choose access</h3>
            <p>
              Compare a membership, a pass or an event ticket before paying.
            </p>
          </li>
          <li>
            <span className="guide-step-number">03</span>
            <CalendarDays size={22} aria-hidden="true" />
            <h3>Show up</h3>
            <p>Use your access for the place, session or event you selected.</p>
          </li>
          <li>
            <span className="guide-step-number">04</span>
            <Users size={22} aria-hidden="true" />
            <h3>Stay connected</h3>
            <p>
              See useful activity from the fitness communities you belong to.
            </p>
          </li>
        </ol>
      </section>

      <section className="guide-people" id="for-people">
        <div className="guide-section-heading guide-section-heading-wide">
          <div>
            <span className="eyebrow">FOR PEOPLE</span>
            <h2>Three clear ways to take part.</h2>
          </div>
          <p>
            Choose ongoing access, a smaller commitment or a dated experience.
            The important details should be visible before you decide.
          </p>
        </div>

        <div className="guide-access-grid">
          <article className="membership">
            <div className="guide-product-icon">
              <WalletCards size={23} aria-hidden="true" />
            </div>
            <span className="guide-product-kicker">ONGOING ACCESS</span>
            <h3>Memberships</h3>
            <p>
              Recurring access to a fitness business, with the duration,
              included activities and renewal terms shown up front.
            </p>
            <strong>Best for a regular routine</strong>
          </article>
          <article className="pass">
            <div className="guide-product-icon">
              <Dumbbell size={23} aria-hidden="true" />
            </div>
            <span className="guide-product-kicker">FLEXIBLE ACCESS</span>
            <h3>Passes</h3>
            <p>
              Access for one class or a limited number of visits, without the
              commitment of an ongoing membership.
            </p>
            <strong>Best for trying something or mixing it up</strong>
          </article>
          <article className="event">
            <div className="guide-product-icon">
              <CalendarDays size={23} aria-hidden="true" />
            </div>
            <span className="guide-product-kicker">DATED EXPERIENCE</span>
            <h3>Events</h3>
            <p>
              A ticket for a specific fitness or community experience, with the
              date, location and what is included made clear.
            </p>
            <strong>Best for a shared moment</strong>
          </article>
        </div>

        <div className="guide-sponsored-event">
          <div className="guide-sponsored-icon">
            <BadgeCheck size={24} aria-hidden="true" />
          </div>
          <div>
            <span className="eyebrow">SPONSORED EVENTS</span>
            <h3>A business can help cover the cost of showing up.</h3>
            <p>
              A sponsor funds all or part of an event so people can attend for
              free or at a lower price. It is still an event—not a contest,
              prize pool or vote.
            </p>
          </div>
        </div>

        <div className="discovery-links">
          <Link className="button dark" href="/explore">
            Explore activities <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        className="guide-community-loop"
        aria-labelledby="community-loop-title"
      >
        <div>
          <span className="eyebrow">WHERE COMMUNITY FITS</span>
          <h2 id="community-loop-title">
            Access gets you through the door. Showing up builds the community.
          </h2>
        </div>
        <div className="guide-loop-steps">
          <span>
            <Building2 size={21} aria-hidden="true" />A business offers access
          </span>
          <ArrowRight size={18} aria-hidden="true" />
          <span>
            <UserRound size={21} aria-hidden="true" />A person chooses what fits
          </span>
          <ArrowRight size={18} aria-hidden="true" />
          <span>
            <Users size={21} aria-hidden="true" />
            Participation creates connection
          </span>
        </div>
        <p>
          The shared activity view will stay intentionally small: useful updates
          about real participation, without engagement mechanics.
        </p>
      </section>

      <section className="guide-clubs" id="for-clubs">
        <div className="guide-section-heading guide-section-heading-wide">
          <div>
            <span className="eyebrow">FOR FITNESS BUSINESSES</span>
            <h2>Make it easier for people to say yes.</h2>
          </div>
          <p>
            Present your access options clearly, reach people looking for their
            next activity and use events to bring your community together.
          </p>
        </div>
        <div className="guide-club-grid">
          <article>
            <Compass size={22} aria-hidden="true" />
            <h3>Publish access</h3>
            <p>
              List memberships, passes and events together, with the terms a
              person needs to choose confidently.
            </p>
          </article>
          <article>
            <CalendarDays size={22} aria-hidden="true" />
            <h3>Welcome new people</h3>
            <p>
              Use flexible passes and dated events to create a low-commitment
              first step into your business.
            </p>
          </article>
          <article>
            <BadgeCheck size={22} aria-hidden="true" />
            <h3>Sponsor attendance</h3>
            <p>
              Fund or subsidize an event to make participation more accessible
              and connect your brand to a real experience.
            </p>
          </article>
        </div>
        <div className="guide-club-future">
          <ShieldCheck size={21} aria-hidden="true" />
          <p>
            Business tools, live inventory and payments are not live yet. The
            current club area demonstrates the planned access and authority
            model using fixture data only.
          </p>
        </div>
        <div className="discovery-links">
          <Link className="button lime" href="/clubs/sign-in">
            Manage a club <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/explore">
            See public discovery
          </Link>
        </div>
      </section>

      <section className="guide-now" aria-labelledby="guide-now-title">
        <div className="guide-section-heading">
          <span className="eyebrow">AN HONEST PREVIEW</span>
          <h2 id="guide-now-title">What works today—and what comes next.</h2>
        </div>
        <div className="guide-now-grid">
          <article>
            <span className="guide-now-label available">YOU CAN TRY NOW</span>
            <h3>Explore the product direction</h3>
            <ul>
              <li>Browse demonstration activities and places</li>
              <li>Open event and class details</li>
              <li>Preview checkout and club access screens</li>
              <li>Sign in and connect a wallet without moving funds</li>
            </ul>
          </article>
          <article>
            <span className="guide-now-label planned">PLANNED NEXT</span>
            <h3>Use real access products</h3>
            <ul>
              <li>Buy and manage memberships or passes</li>
              <li>Purchase event tickets</li>
              <li>Transfer eligible access when terms permit it</li>
              <li>Publish business inventory and sponsored events</li>
            </ul>
          </article>
        </div>
        <p className="guide-fixture-note">
          Everything currently shown is demonstration data. No membership, pass,
          ticket or sponsorship purchase is live, and no real funds move.
        </p>
      </section>

      <section className="guide-faq">
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2>A few common questions.</h2>
        <details>
          <summary>Can I browse without an account?</summary>
          <p>
            Yes. Public discovery is open. An account will be needed for
            personal actions such as managing access, tickets and transfers.
          </p>
        </details>
        <details>
          <summary>Do I need a wallet?</summary>
          <p>
            Not to browse or sign in. A wallet may support future test payments
            and transfers, but connecting one does not approve a transaction.
            Each payment will need its own clear confirmation.
          </p>
        </details>
        <details>
          <summary>What can be transferred?</summary>
          <p>
            Only access marked as transferable by the fitness business. Its
            rules, timing and any limits must be visible before a transfer.
            Transfer capability is planned and is not live in this preview.
          </p>
        </details>
        <details>
          <summary>What is a sponsored event?</summary>
          <p>
            It is a normal event whose cost is partly or fully covered by a
            sponsor. People attend the experience; there is no winner, voting
            process or prize pool.
          </p>
        </details>
      </section>

      <section className="guide-preview">
        <span className="eyebrow">START WITH DISCOVERY</span>
        <h2>See what moving with MovX Club could feel like.</h2>
        <p>
          Browse the demonstration catalogue and compare the kinds of fitness
          experiences the access model is designed to support.
        </p>
        <div className="discovery-links">
          <Link className="button lime" href="/explore">
            Explore activities <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
