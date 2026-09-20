"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  Check,
  RotateCcw,
  Wallet,
  LockKeyhole,
  ArrowLeft,
  Footprints,
  Flag,
} from "lucide-react";
import { classes, people, challenges } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";
import { Avatar, ChallengeCard, Empty, Modal, Pill, SectionTitle } from "./ui";
import { DraftList } from "./challenges";

export function Profile({ personId }: { personId?: string }) {
  const { state, dispatch } = useDemo();
  const [reset, setReset] = useState(false);
  const [tab, setTab] = useState("My sessions");
  const person = people.find((p) => p.id === personId);
  if (personId && !person)
    return (
      <Empty
        title="We haven’t met this member yet."
        description="This profile isn’t part of the demo community."
        href="/profile"
        action="Back to your profile"
      />
    );
  if (person)
    return (
      <>
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          Back to the club
        </Link>
        <section className="profile-cover">
          <span className="profile-cover-word">GOOD COMPANY.</span>
        </section>
        <div className="profile-heading">
          <Avatar initials={person.initials} color={person.color} />
          <div>
            <h1>{person.name}</h1>
            <p>{person.bio} · Berlin</p>
            <Pill>Demo community member</Pill>
          </div>
          <button
            className="button dark"
            onClick={() => dispatch({ type: "follow", id: person.id })}
          >
            {state.following.includes(person.id) ? <Check size={16} /> : null}
            {state.following.includes(person.id) ? "Following" : "Follow"}
          </button>
        </div>
        <section className="profile-public-note">
          <Footprints size={24} />
          <h2>Movement is better with company.</h2>
          <p>
            Follow {person.name.split(" ")[0]} to see their demo class joins and
            challenges in your Following feed.
          </p>
        </section>
        <SectionTitle title="Something to try together" href="/challenges" />
        <div className="challenge-grid">
          {challenges.slice(0, 2).map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </>
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR OWN KIND OF PROGRESS</span>
          <h1>
            Your corner of the club<span className="lime-text">.</span>
          </h1>
        </div>
        <button
          className="button secondary reset-button"
          onClick={() => setReset(true)}
        >
          <RotateCcw size={15} />
          Reset preview
        </button>
      </div>
      <section className="profile-cover">
        <span className="profile-cover-word">KEEP SHOWING UP.</span>
        <span className="cover-spark">✳</span>
      </section>
      <div className="profile-heading">
        <Avatar />
        <div>
          <h2>Anna Klein</h2>
          <p>
            <MapPin size={14} />
            Berlin · Here for the movement, staying for the people.
          </p>
          <Pill>Demo profile</Pill>
        </div>
        <Link href="/challenges/new" className="button dark">
          <Flag size={16} />
          Start a challenge
        </Link>
      </div>
      <div className="profile-grid">
        <div>
          <div className="profile-stats">
            <div>
              <strong>12</strong>
              <span>Confirmed visits</span>
              <small>Illustrative history</small>
            </div>
            <div>
              <strong>{state.following.length}</strong>
              <span>Following</span>
              <small>Your local choices</small>
            </div>
            <div>
              <strong>
                {state.bookings.filter((b) => b.status === "booked").length}
              </strong>
              <span>Upcoming sessions</span>
              <small>Local simulations</small>
            </div>
          </div>
          <div className="chips profile-tabs" aria-label="Profile section">
            {["My sessions", "My drafts", "My people"].map((t) => (
              <button
                key={t}
                className={`chip ${tab === t ? "active" : ""}`}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "My drafts" ? (
            <DraftList />
          ) : tab === "My people" ? (
            <div className="rail-card people-list">
              {people.map((p) => (
                <div className="person-row" key={p.id}>
                  <Avatar initials={p.initials} color={p.color} />
                  <Link href={`/users/${p.id}`}>
                    <strong>{p.name}</strong>
                    <small>{p.bio}</small>
                  </Link>
                  <button
                    className="button secondary small-button"
                    onClick={() => dispatch({ type: "follow", id: p.id })}
                  >
                    {state.following.includes(p.id) ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          ) : state.bookings.length ? (
            <div className="draft-list">
              {state.bookings.map((b) => {
                const c = classes.find((c) => c.id === b.classId)!;
                return (
                  <Link
                    key={b.classId}
                    className="draft-row"
                    href={`/classes/${c.id}`}
                  >
                    <span className="date-block">
                      <small>{c.day}</small>
                      <strong>{c.date.split(" ")[0]}</strong>
                    </span>
                    <div>
                      <h3>{c.title}</h3>
                      <p>
                        {c.gym} · {c.time}
                      </p>
                    </div>
                    <Pill tone={b.status === "booked" ? "lime" : "neutral"}>
                      {b.status === "booked" ? "Demo booking" : "Cancelled"}
                    </Pill>
                    <ArrowUpRight size={18} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <Empty
              title="Your next good habit starts here."
              description="Explore the demo sessions and find your next reason to show up."
              href="/explore"
              action="Find a session"
            />
          )}
        </div>
        <aside>
          <section className="rail-card balance-card">
            <div className="rail-title">
              <h2>
                <Wallet size={18} />
                Your balance
              </h2>
              <LockKeyhole size={15} />
            </div>
            <Pill tone="amber">Sample balance · Wallet not connected</Pill>
            <p>Available test EURC</p>
            <strong className="balance-amount">€40.00</strong>
            <div className="balance-secondary">
              <div>
                <span>Committed to challenges</span>
                <strong>€6.00</strong>
              </div>
              <div>
                <span>Awaiting payout</span>
                <strong>€10.00</strong>
              </div>
            </div>
            <p className="small-copy">
              Committed funds and unclaimed payouts aren’t available to spend.
              These figures are examples, not wallet balances.
            </p>
            <div className="balance-foot">Devnet target · No real money</div>
          </section>
        </aside>
      </div>
      {reset && (
        <Modal
          title="Start with a clean slate?"
          onClose={() => setReset(false)}
        >
          <p className="dialog-copy">
            This clears local drafts, demo bookings, saved challenges and
            follows. No real accounts, funds or blockchain records are affected.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setReset(false)}
            >
              Keep my preview
            </button>
            <button
              className="button dark"
              onClick={() => {
                dispatch({ type: "reset" });
                setReset(false);
              }}
            >
              Reset local preview
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
