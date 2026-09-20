"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  MapPin,
  CalendarDays,
  Users,
  Flag,
  EyeOff,
  Footprints,
} from "lucide-react";
import { challenges, classes, people } from "@/features/preview/catalogue";
import { visibleBookings } from "@/features/preview/state";
import { useDemo } from "@/features/preview/store";
import {
  Avatar,
  AvatarStack,
  Artwork,
  ChallengeCard,
  Empty,
  Pill,
  SectionTitle,
} from "@/components/ui";

export function Feed() {
  const [filter, setFilter] = useState("For you");
  const { state, dispatch } = useDemo();
  const showDaniel = filter === "For you" || state.following.includes("daniel");
  const showMax = filter === "For you" || state.following.includes("max");
  const own = visibleBookings(state);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR DAILY DOSE OF MOVEMENT</span>
          <h1>
            Better together<span className="lime-text">.</span>
          </h1>
          <p>A little progress. Good people. Welcome back, Anna.</p>
        </div>
        <span className="heading-date">
          SATURDAY, 19 SEPTEMBER
          <br />
          <strong>Let’s make a move.</strong>
        </span>
      </div>
      <div className="feed-layout">
        <div className="feed-main">
          <section className="hero">
            <Artwork kind="run" large />
            <div className="hero-copy">
              <Pill tone="glass">
                <span className="status-dot" />
                YOUR PEOPLE ARE OUT THERE
              </Pill>
              <h2>
                Good energy.
                <br />
                Better company.
              </h2>
              <p>
                Find a challenge. Bring a friend.
                <br />
                Make showing up the best part of your day.
              </p>
              <Link href="/challenges" className="button lime">
                Find your challenge <ArrowUpRight size={18} />
              </Link>
            </div>
            <span className="hero-corner">01 / CLUB CULTURE</span>
          </section>
          <div className="feed-section-heading">
            <h2>Around your club</h2>
            <div className="segment" aria-label="Feed filter">
              {["For you", "Following"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  className={filter === f ? "selected" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="activity-list">
            {own.map((booking) => {
              const session = classes.find((c) => c.id === booking.classId)!;
              return (
                <article className="activity-card" key={booking.classId}>
                  <div className="activity-person">
                    <Avatar />
                    <div>
                      <p>
                        <strong>You</strong>{" "}
                        {booking.status === "cancelled"
                          ? "cancelled a class booking"
                          : "joined a class"}
                      </p>
                      <small>Local simulation · shared in this browser</small>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={`Hide ${session.title} activity`}
                      onClick={() =>
                        dispatch({ type: "hide", classId: session.id })
                      }
                    >
                      <EyeOff size={17} />
                    </button>
                  </div>
                  <div className="activity-session">
                    <span className="date-block">
                      <small>{session.day}</small>
                      <strong>{session.date.split(" ")[0]}</strong>
                    </span>
                    <div>
                      <h3>{session.title}</h3>
                      <p>
                        {session.gym} · {session.time}
                      </p>
                    </div>
                    <Pill
                      tone={booking.status === "cancelled" ? "neutral" : "lime"}
                    >
                      {booking.status === "cancelled"
                        ? "Cancelled"
                        : "Demo booking"}
                    </Pill>
                  </div>
                  <p className="activity-caption">
                    A booking is a plan to attend. Only gym confirmation records
                    a visit.
                  </p>
                  <Link className="text-link" href={`/classes/${session.id}`}>
                    View session <ArrowUpRight size={16} />
                  </Link>
                </article>
              );
            })}
            {showDaniel && (
              <article className="activity-card">
                <div className="activity-person">
                  <Avatar initials="DP" color="peach" />
                  <div>
                    <p>
                      <Link href="/users/daniel">
                        <strong>Daniel Park</strong>
                      </Link>{" "}
                      created a challenge
                    </p>
                    <small>2 hours ago · Demo activity</small>
                  </div>
                  <Pill tone="subtle">
                    <Flag size={12} />
                    Community
                  </Pill>
                </div>
                <p className="activity-caption big">
                  “The best kind of morning starts with a run and ends with
                  coffee. Who’s in?”
                </p>
                <Link
                  href="/challenges/before-coffee"
                  className="feed-challenge"
                >
                  <div className="feed-challenge-thumb">
                    <Artwork kind="run" />
                  </div>
                  <div>
                    <span className="eyebrow">RUNNING · 7 DAYS</span>
                    <h3>The 5K before coffee</h3>
                    <span className="meta-line">
                      <Users size={14} />5 of 10 spots · €2.00 test EURC entry
                    </span>
                  </div>
                  <ArrowUpRight size={22} />
                </Link>
                <div className="activity-footer">
                  <AvatarStack />
                  <span>Good company is part of the plan.</span>
                  <Link className="text-link" href="/challenges/before-coffee">
                    Take a look <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            )}
            {showMax && (
              <article className="activity-card">
                <div className="activity-person">
                  <Avatar initials="MM" color="blue" />
                  <div>
                    <p>
                      <Link href="/users/max">
                        <strong>Max Müller</strong>
                      </Link>{" "}
                      joined a class
                    </p>
                    <small>3 hours ago · Demo activity</small>
                  </div>
                  <Pill tone="subtle">
                    <CalendarDays size={12} />
                    Class join
                  </Pill>
                </div>
                <div className="activity-session">
                  <span className="session-icon">
                    <Footprints size={25} />
                  </span>
                  <div>
                    <h3>Muay Thai fundamentals</h3>
                    <p>Kru Tiger · Tue, 22 Sep · 18:00</p>
                  </div>
                  <Link
                    href="/classes/muay-thai"
                    className="circle-link"
                    aria-label="View Muay Thai fundamentals"
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
                <p className="activity-caption">
                  A spot on the mats, and one more reason to show up.
                </p>
                <Link href="/classes/muay-thai" className="text-link">
                  Join the session <ArrowRight size={15} />
                </Link>
              </article>
            )}
            {!showDaniel && !showMax && own.length === 0 && (
              <Empty
                title="Your people, your feed."
                description="Follow a few club members to see their next moves here."
                href="/profile"
                action="Meet the community"
              />
            )}
          </div>
          <SectionTitle title="A little extra motivation" href="/challenges" />
          <div className="two-card-grid">
            {challenges.slice(1).map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                saved={state.saved.includes(challenge.id)}
                onToggleSaved={() =>
                  dispatch({ type: "save", id: challenge.id })
                }
              />
            ))}
          </div>
        </div>
        <aside className="feed-rail">
          <section className="rail-card rhythm-card">
            <div className="rail-title">
              <h2>Your weekly rhythm</h2>
              <Pill tone="lime">
                <span className="status-dot" />
                Looking good
              </Pill>
            </div>
            <div className="rhythm-number">
              2<span>/ 3</span>
              <small>weekly visit goal</small>
            </div>
            <div className="week-days">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                <div key={i}>
                  <span
                    className={
                      i === 1 || i === 3 ? "done" : i === 5 ? "today" : ""
                    }
                  >
                    {i === 1 || i === 3 ? <Check size={15} /> : <i />}
                  </span>
                  <small>{day}</small>
                </div>
              ))}
            </div>
            <p>One more session. You’ve got this.</p>
            <span className="fixture-note">
              Illustrative gym-confirmed visits
            </span>
          </section>
          <section className="rail-card next-session">
            <div className="rail-title">
              <h2>Next in your club</h2>
              <CalendarDays size={17} />
            </div>
            <span className="eyebrow">TUESDAY, 22 SEPTEMBER</span>
            <h3>
              Muay Thai
              <br />
              fundamentals
            </h3>
            <p>
              <MapPin size={14} />
              Kru Tiger, Kreuzberg
            </p>
            <div className="session-time">
              <strong>18:00</strong>
              <span>60 min · All levels</span>
            </div>
            <Link href="/classes/muay-thai" className="button secondary full">
              Your membership covers it <ArrowUpRight size={16} />
            </Link>
          </section>
          <section className="rail-card">
            <SectionTitle title="Good company" href="/profile" action="More" />
            <div className="people-list">
              {people.map((person) => (
                <div className="person-row" key={person.id}>
                  <Link
                    href={`/users/${person.id}`}
                    aria-label={`View ${person.name}`}
                  >
                    <Avatar
                      initials={person.initials}
                      color={person.color}
                      small
                    />
                  </Link>
                  <Link href={`/users/${person.id}`}>
                    <strong>{person.name}</strong>
                    <small>{person.bio}</small>
                  </Link>
                  <button
                    className={`follow-button ${state.following.includes(person.id) ? "following" : ""}`}
                    aria-label={`${state.following.includes(person.id) ? "Unfollow" : "Follow"} ${person.name}`}
                    onClick={() => dispatch({ type: "follow", id: person.id })}
                  >
                    {state.following.includes(person.id) ? (
                      <Check size={15} />
                    ) : (
                      "+"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
          <div className="rail-manifesto">
            <span>MORE THAN A WORKOUT.</span>
            <h3>
              A reason
              <br />
              to show up.
            </h3>
            <p>Social fitness, onchain.</p>
            <span className="manifesto-mark" aria-hidden="true">
              ↗
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}
