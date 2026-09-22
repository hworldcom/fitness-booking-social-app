import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Compass,
  Users,
  Flag,
  Coffee,
  Dumbbell,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

export function HowItWorksScreen() {
  return (
    <div className="how-it-works">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WELCOME TO MOVX CLUB</span>
          <h1>
            A little plan.
            <br />A little more together<span className="lime-text">.</span>
          </h1>
          <p>
            Find an activity, bring your people and give each other a reason to
            show up.
          </p>
        </div>
      </div>
      <nav className="guide-audiences" aria-label="Choose how MovX Club helps">
        <Link href="#for-people" className="guide-audience people">
          <UserRound size={27} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <small>FOR PEOPLE</small>
            <strong>The social layer</strong>
            <p>
              Discover activities, create with your people and make real
              progress worth sharing.
            </p>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        <Link href="#for-clubs" className="guide-audience clubs">
          <Building2 size={27} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <small>FOR FITNESS AND SPORTS CLUBS</small>
            <strong>The community channel</strong>
            <p>
              Reach participants, shape experiences and manage accountable club
              authority.
            </p>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </nav>

      <section className="guide-people" id="for-people">
        <div className="guide-people-heading">
          <div>
            <span className="eyebrow">FOR PEOPLE · THE SOCIAL LAYER</span>
            <h2>Turn showing up into something you share.</h2>
            <p>
              Find a reason to move, bring your people and build a visible
              rhythm around real participation rather than empty engagement.
            </p>
          </div>
          <UserRound size={54} strokeWidth={1.2} aria-hidden="true" />
        </div>
        <div className="guide-steps">
          <article>
            <div className="guide-step-top">
              <span className="guide-step-number">
                01 <Compass size={22} aria-hidden="true" />
              </span>
              <span className="guide-status available">Preview available</span>
            </div>
            <h3>Discover your next move</h3>
            <p>
              Browse demonstration classes, studios, events and challenges.
              Public Explore and Challenges need no login or wallet.
            </p>
          </article>
          <article>
            <div className="guide-step-top">
              <span className="guide-step-number">
                02 <Users size={22} aria-hidden="true" />
              </span>
              <span className="guide-status planned">Access planned</span>
            </div>
            <h3>Choose your kind of together</h3>
            <p>
              Compare classes, events and challenge rules before committing.
              Real booking, entry and payment flows are not live yet.
            </p>
          </article>
          <article>
            <div className="guide-step-top">
              <span className="guide-step-number">
                03 <Flag size={22} aria-hidden="true" />
              </span>
              <span className="guide-status preview">
                Browser draft preview
              </span>
            </div>
            <h3>Create with your community</h3>
            <p>
              Plan a challenge or event around your people. Current drafts stay
              in this browser and are not published or funded.
            </p>
          </article>
          <article>
            <div className="guide-step-top">
              <span className="guide-step-number">
                04 <BadgeCheck size={22} aria-hidden="true" />
              </span>
              <span className="guide-status planned">Shared data planned</span>
            </div>
            <h3>Make real progress social</h3>
            <p>
              Confirmed participation can later become trusted community
              activity. A plan, payment or wallet connection is not attendance.
            </p>
          </article>
        </div>
        <div className="guide-choices">
          <span className="eyebrow">FOUR WAYS TO TAKE PART</span>
          <h3>Pick what moves you.</h3>
          <div className="guide-choice-grid">
            <article>
              <Dumbbell size={23} />
              <h4>Classes</h4>
              <p>
                Find a studio and a dated session, then buy a class pass. A pass
                grants class access; staff confirmation separately records your
                visit.
              </p>
              <Link href="/explore" className="text-link">
                Find a class <ArrowRight size={15} />
              </Link>
            </article>
            <article>
              <Coffee size={23} />
              <h4>Events</h4>
              <p>
                Pay for a shared experience with something included for every
                ticket holder. Run & Coffee includes a social 5K and a coffee.
                No prize, winner or vote.
              </p>
              <Link href="/explore?view=events" className="text-link">
                Explore events <ArrowRight size={15} />
              </Link>
            </article>
            <article>
              <Users size={23} />
              <h4>Community challenges</h4>
              <p>
                Participants contribute to a shared pool and vote after the
                challenge. At least half must vote; below that turnout at the
                deadline, the pool is shared evenly among participants.
              </p>
              <Link href="/challenges?mode=community" className="text-link">
                See community challenges <ArrowRight size={15} />
              </Link>
            </article>
            <article>
              <Flag size={23} />
              <h4>Sponsored challenges</h4>
              <p>
                The creator funds the prize and chooses the winner under the
                challenge rules. If no winner is chosen within 24 hours of the
                end, the pool is shared evenly among participants.
              </p>
              <Link href="/challenges?mode=sponsored" className="text-link">
                See sponsored challenges <ArrowRight size={15} />
              </Link>
            </article>
          </div>
        </div>
        <div className="discovery-links">
          <Link className="button dark" href="/explore">
            Explore as a participant <ArrowRight size={17} />
          </Link>
          <Link className="button secondary" href="/challenges">
            Find a challenge
          </Link>
        </div>
      </section>

      <section
        className="guide-community-loop"
        aria-labelledby="community-loop-title"
      >
        <div>
          <span className="eyebrow">ONE COMMUNITY LOOP</span>
          <h2 id="community-loop-title">
            Clubs create the reasons to show up. People make them social.
          </h2>
        </div>
        <div className="guide-loop-steps">
          <span>
            <Building2 size={21} aria-hidden="true" />
            Clubs shape activities
          </span>
          <ArrowRight size={18} aria-hidden="true" />
          <span>
            <Users size={21} aria-hidden="true" />
            People discover and participate
          </span>
          <ArrowRight size={18} aria-hidden="true" />
          <span>
            <BadgeCheck size={21} aria-hidden="true" />
            Verified activity can become shared progress
          </span>
        </div>
        <p>
          Public discovery is available as a preview. Persistent publishing,
          confirmed participation and shared activity remain planned.
        </p>
      </section>

      <section className="guide-clubs" id="for-clubs">
        <div className="guide-clubs-heading">
          <div>
            <span className="eyebrow">FOR FITNESS AND SPORTS CLUBS</span>
            <h2>Turn activities into a community people return to.</h2>
            <p>
              MovX Club gives clubs one public place to help people discover
              what is happening, join shared experiences and keep showing up
              together.
            </p>
          </div>
          <Building2 size={54} strokeWidth={1.2} aria-hidden="true" />
        </div>
        <div className="guide-club-grid">
          <article>
            <span className="guide-status available">Preview available</span>
            <Compass size={22} aria-hidden="true" />
            <h3>Reach new participants</h3>
            <p>
              Classes, events and challenges can appear together in public
              discovery. Current listings are demonstration data rather than
              live club inventory.
            </p>
          </article>
          <article>
            <span className="guide-status preview">Browser draft preview</span>
            <CalendarDays size={22} aria-hidden="true" />
            <h3>Shape club experiences</h3>
            <p>
              Plan events and sponsored challenges that fit your community.
              Drafts currently stay in one browser and are not published.
            </p>
          </article>
          <article>
            <span className="guide-status planned">Planned shared data</span>
            <Users size={22} aria-hidden="true" />
            <h3>Strengthen participation</h3>
            <p>
              Confirmed attendance and shared activity can later help members
              see progress and give one another a reason to return.
            </p>
          </article>
          <article>
            <span className="guide-status prepared">Prepared access</span>
            <ShieldCheck size={22} aria-hidden="true" />
            <h3>Keep club authority separate</h3>
            <p>
              Administrators sign in as themselves. Prepared clubs use a
              distinct wallet proof for bounded club authority, separate from
              personal accounts and wallets.
            </p>
          </article>
        </div>
        <div className="guide-club-future">
          <WalletCards size={21} aria-hidden="true" />
          <p>
            Class-pass and event-ticket sales, sponsorship funding and refunds
            are planned for Solana Devnet test funds. No payment, balance or
            transaction capability is live on this club page today.
          </p>
        </div>
        <div className="discovery-links">
          <Link className="button lime" href="/clubs/sign-in">
            Manage a club <ArrowRight size={17} />
          </Link>
          <Link className="button secondary" href="/explore">
            See public discovery
          </Link>
        </div>
      </section>
      <section className="guide-faq">
        <h2>A few things to know</h2>
        <details>
          <summary>Do I need a wallet?</summary>
          <p>
            You can browse and sign in without one. You may link Phantom to your
            personal account later. A prepared club administrator proves the
            club wallet separately. Payments are not live, and each future
            transaction will need its own approval.
          </p>
        </details>
        <details>
          <summary>Is this real money?</summary>
          <p>
            No. The hackathon targets test EURC on Solana Devnet, with test SOL
            for network costs. Today’s balances, pools and receipts are
            examples; no funds are deposited or paid.
          </p>
        </details>
        <details>
          <summary>What if a plan is cancelled?</summary>
          <p>
            A challenge cancelled before it starts returns contributions to the
            participants, or sponsored funds to the creator. Class passes bought
            less than 24 hours before the class and no-shows are non-refundable
            for customer cancellation. The full class refund policy and
            event-specific cancellation terms are still being finalized and must
            be shown before real test-token purchases.
          </p>
        </details>
        <details>
          <summary>Can I organize something?</summary>
          <p>
            Yes. Friends, trainers, gyms, cafés and organizations can plan a
            challenge or event. Try saving a draft now; it stays in this browser
            and is not published. Authenticated creation, invitations and
            funding come with the backend integration.
          </p>
        </details>
      </section>
      <section className="guide-preview">
        <span className="eyebrow">WHAT YOU CAN TRY TODAY</span>
        <h2>Explore the preview. Make a little plan.</h2>
        <p>
          Browse, save inspiration and create local drafts. Venues, schedules
          and activity are demonstration data. Entry, checkout and attendance
          flows are not live yet.
        </p>
        <div className="discovery-links">
          <Link className="button lime" href="/explore">
            Explore activities <ArrowRight size={17} />
          </Link>
          <Link className="button secondary" href="/challenges">
            Find a challenge
          </Link>
        </div>
      </section>
    </div>
  );
}
