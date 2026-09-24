"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CalendarDays,
  Footprints,
  Coffee,
} from "lucide-react";
import { people, studios } from "@/features/preview/catalogue";
import { useDemo } from "@/features/preview/store";
import {
  Avatar,
  AvatarStack,
  Empty,
  Pill,
  SectionTitle,
} from "@/components/ui";

import { ShoeDoodle, StarDoodle } from "@/components/club-doodles";

export function Feed() {
  const [filter, setFilter] = useState("For you");
  const { state, dispatch, requestPrivateAccess } = useDemo();
  const showDaniel = filter === "For you" || state.following.includes("daniel");
  const showMax = filter === "For you" || state.following.includes("max");
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
            Discover local gyms and studios, choose flexible access, and keep
            showing up together.
          </p>
          <div className="club-hero-actions">
            <Link href="/explore" className="button lime">
              Explore activities <ArrowRight size={18} />
            </Link>
            <Link href="/how-it-works" className="button secondary">
              How it works <ArrowUpRight size={18} />
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
                  onClick={() => {
                    if (f === "Following" && !requestPrivateAccess()) return;
                    setFilter(f);
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="activity-list">
            {showDaniel && (
              <article className="activity-card">
                <div className="activity-person">
                  <Avatar initials="DP" color="peach" />
                  <div>
                    <p>
                      <Link href="/users/daniel">
                        <strong>Daniel Park</strong>
                      </Link>{" "}
                      is joining an event
                    </p>
                    <small>2 hours ago · Demo activity</small>
                  </div>
                  <Pill tone="subtle">
                    <CalendarDays size={12} />
                    Event
                  </Pill>
                </div>
                <div className="activity-session">
                  <span className="session-icon">
                    <Coffee size={25} />
                  </span>
                  <div>
                    <h3>Run &amp; Coffee</h3>
                    <p>Sunday Coffee · Sun, 27 Sep · 09:00</p>
                  </div>
                  <Link
                    href="/events/run-and-coffee"
                    className="circle-link"
                    aria-label="View Run & Coffee"
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
                <p className="activity-caption">
                  A social 5K, a coffee and a few familiar faces.
                </p>
                <div className="activity-footer">
                  <AvatarStack />
                  <span>Good company is part of the plan.</span>
                  <Link className="text-link" href="/events/run-and-coffee">
                    View event <ArrowRight size={15} />
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
            {!showDaniel && !showMax && (
              <Empty
                title="Your people, your feed."
                description="Follow a few club members to see their next moves here."
                href="/explore"
                action="Explore activities"
              />
            )}
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
            <SectionTitle title="Good company" />
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
