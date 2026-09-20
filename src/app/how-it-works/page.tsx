import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Users,
  Flag,
  Coffee,
  Dumbbell,
} from "lucide-react";

export const metadata = { title: "How it works" };
export default function Page() {
  return (
    <div className="how-it-works">
      <div className="page-heading">
        <div>
          <span className="eyebrow">WELCOME TO REPX CLUB</span>
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
      <div className="guide-steps">
        <section>
          <span className="guide-step-number">
            01 <Compass size={22} />
          </span>
          <h2>Find your next move</h2>
          <p>
            Browse classes, studios, events and challenges. Explore and
            Challenges are open to everyone, with no login or wallet needed to
            look around.
          </p>
        </section>
        <section>
          <span className="guide-step-number">
            02 <Users size={22} />
          </span>
          <h2>Choose your kind of together</h2>
          <p>
            Book a class, meet at an event or work towards a challenge. Check
            the dates, cost and participation rules before you commit.
          </p>
        </section>
        <section>
          <span className="guide-step-number">
            03 <Flag size={22} />
          </span>
          <h2>Show up for each other</h2>
          <p>
            A shared class booking lets your friends know your plan. Gym staff
            confirms attendance separately. Challenge rewards follow the
            published voting or judging rules.
          </p>
        </section>
      </div>
      <section className="guide-choices">
        <span className="eyebrow">FOUR WAYS TO TAKE PART</span>
        <h2>Pick what moves you.</h2>
        <div className="guide-choice-grid">
          <article>
            <Dumbbell size={23} />
            <h3>Classes</h3>
            <p>
              Find a studio and a dated session. Use eligible membership access
              or buy a class pass. A booking is your plan; staff confirmation
              records your visit.
            </p>
            <Link href="/explore" className="text-link">
              Find a class <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <Coffee size={23} />
            <h3>Events</h3>
            <p>
              Pay for a shared experience with something included for every
              ticket holder. Run & Coffee includes a social 5K and a coffee. No
              prize, winner or vote.
            </p>
            <Link href="/explore?view=events" className="text-link">
              Explore events <ArrowRight size={15} />
            </Link>
          </article>
          <article>
            <Users size={23} />
            <h3>Community challenges</h3>
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
            <h3>Sponsored challenges</h3>
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
      </section>
      <section className="guide-faq">
        <h2>A few things to know</h2>
        <details>
          <summary>Do I need a wallet?</summary>
          <p>
            You can browse without one. The planned demo uses Phantom for
            sign-in and Solana Devnet transactions with test EURC. Signing in
            proves ownership; each payment needs its own approval. Wallet
            sign-in and payments are not connected in this preview.
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
