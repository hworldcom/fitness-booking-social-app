"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CalendarDays,
  Users,
  Flag,
  EyeOff,
  Footprints,
  Coffee,
} from "lucide-react";
import {
  challenges,
  classes,
  people,
  studios,
} from "@/features/preview/catalogue";
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

import { ShoeDoodle, StarDoodle } from "@/components/club-doodles";

export function Feed() {
  const [filter, setFilter] = useState("For you");
  const { state, dispatch } = useDemo();
  const showDaniel = filter === "For you" || state.following.includes("daniel");
  const showMax = filter === "For you" || state.following.includes("max");
  const own = visibleBookings(state);
  return (
    <>
      <section className="club-hero" aria-labelledby="club-welcome">
        <div className="club-hero-copy">
          <span className="eyebrow">A LITTLE MOVEMENT. GOOD COMPANY.</span>
          <h1 id="club-welcome">
            FIND YOUR PEOPLE.
            <br />
            <span>MOVE TOGETHER.</span>
          </h1>
          <p>
            Discover local gyms and studios, join classes, and take on
            challenges together.
          </p>
          <div className="club-hero-actions">
            <Link href="/explore" className="button lime">
              Explore classes <ArrowRight size={18} />
            </Link>
            <Link href="/challenges" className="button secondary">
              Find a challenge <ArrowUpRight size={18} />
            </Link>
          </div>
          <ShoeDoodle className="club-shoe" />
          <StarDoodle className="club-spark" />
        </div>
        <div className="club-hero-photo">
          <Image
            src="/images/club-friends-hero.webp"
            alt="Illustrative photograph of four friends laughing together after a run in Berlin"
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1000px) 60vw, 50vw"
            preload
          />
          <span className="club-sticker">
            Better with
            <br />
            company <span aria-hidden="true">↗</span>
          </span>
        </div>
      </section>
      <div className="feed-layout">
        <div className="feed-main">
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
          <section
            className="club-discovery"
            aria-label="Local studio discovery"
          >
            <SectionTitle
              title="Find your next spot"
              href="/explore?view=studios"
              action="All studios"
            />
            <p className="fixture-note">
              Example studios · Illustrative imagery
            </p>
            {studios
              .filter(
                (studio) => studio.id === "fabrik" || studio.id === "kru-tiger",
              )
              .map((studio) => (
                <Link
                  key={studio.id}
                  href={`/explore?view=studios&q=${encodeURIComponent(studio.name)}`}
                  className="club-studio-card"
                >
                  <div className="club-studio-photo">
                    <Image
                      src={
                        studio.id === "fabrik"
                          ? "/images/strength-studio.webp"
                          : "/images/muay-thai-studio.webp"
                      }
                      alt={
                        studio.id === "fabrik"
                          ? "Illustrative sunlit strength studio with weights and plants"
                          : "Illustrative Muay Thai studio with punching bags and training mats"
                      }
                      fill
                      sizes="(max-width: 760px) 120px, 150px"
                    />
                  </div>
                  <div>
                    <h3>{studio.name}</h3>
                    <p>
                      {studio.activities.join(" · ")} · {studio.area}
                    </p>
                    <span className="text-link">
                      Explore studio <ArrowUpRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            <div className="club-event-card">
              <div className="club-event-top">
                <span className="eyebrow">A PLAN WITH A LITTLE EXTRA</span>
                <Coffee size={28} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>Run &amp; Coffee</h3>
              <p>A social 5K + a coffee. Good company included.</p>
              <span className="fixture-note">Demo event · Ticket preview</span>
              <Link href="/events/run-and-coffee" className="button secondary">
                View event <ArrowUpRight size={17} />
              </Link>
            </div>
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
        </aside>
      </div>
    </>
  );
}
