"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Footprints,
  Infinity as InfinityIcon,
} from "lucide-react";
import { ShoeDoodle, StarDoodle } from "@/components/club-doodles";
import { Avatar, Empty, Pill, SectionTitle } from "@/components/ui";
import { people, studios } from "@/features/preview/catalogue";
import { useDemo } from "@/features/preview/store";

const sharedCheckins = [
  {
    personId: "daniel",
    initials: "DP",
    color: "peach" as const,
    gym: "Northside Combat",
    area: "Kreuzberg",
    detail: "Muay Thai · Demo verified check-in",
  },
  {
    personId: "max",
    initials: "MM",
    color: "blue" as const,
    gym: "Fabrik Training",
    area: "Neukölln",
    detail: "Strength · Demo verified check-in",
  },
] as const;

export function Feed() {
  const [filter, setFilter] = useState("For you");
  const { state, dispatch, requestPrivateAccess } = useDemo();
  const visibleCheckins = sharedCheckins.filter(
    (item) => filter === "For you" || state.following.includes(item.personId),
  );

  return (
    <>
      <section className="club-hero" aria-labelledby="club-welcome">
        <div className="club-hero-copy">
          <span className="eyebrow">YOUR GYMS. ONE MEMBERSHIP.</span>
          <h1 id="club-welcome">
            A MEMBERSHIP BUILT AROUND <span>YOUR ROUTINE.</span>
          </h1>
          <p>
            Choose your core gyms and the plan that fits how often you train.
            Move between participating gyms, discover new ways to exercise, and
            share verified check-ins only when you choose.
          </p>
          <div className="club-hero-actions">
            <Link href="/explore" className="button lime">
              Explore gyms <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/how-it-works" className="button secondary">
              How it works <ArrowUpRight size={18} aria-hidden="true" />
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
            Built to move
            <br />
            your way <span aria-hidden="true">↗</span>
          </span>
        </div>
      </section>

      <section className="membership-snapshot" aria-labelledby="plans-title">
        <div className="membership-snapshot-heading">
          <div>
            <span className="eyebrow">TWO SIMPLE OPTIONS</span>
            <h2 id="plans-title">Pick the rhythm that fits.</h2>
          </div>
          <p>
            Illustrative demo pricing for one monthly membership period. Your
            selected gyms form your core set for that period.
          </p>
        </div>
        <div className="membership-plan-grid">
          <article className="membership-plan-card basic">
            <div className="membership-plan-topline">
              <span>Basic</span>
              <strong>€80</strong>
            </div>
            <h3>10 included check-ins</h3>
            <p>
              Across your selected core gyms, with at most one included check-in
              per day.
            </p>
          </article>
          <article className="membership-plan-card classic">
            <div className="membership-plan-topline">
              <span>Classic</span>
              <strong>€150</strong>
            </div>
            <h3>
              <InfinityIcon size={25} aria-hidden="true" /> Unlimited check-ins
            </h3>
            <p>
              No numerical allowance; the same one-included-check-in-per-day
              rule applies.
            </p>
          </article>
          <aside
            className="non-core-snapshot"
            aria-label="Non-core member visit"
          >
            <span className="eyebrow">BEYOND YOUR CORE SET</span>
            <strong>€15</strong>
            <p>
              Active members can visit an eligible participating non-core gym at
              the illustrative member price, paid directly to that gym.
            </p>
          </aside>
        </div>
        <div className="membership-snapshot-actions">
          <Link href="/how-it-works" className="text-link">
            Understand the full product loop{" "}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link href="/coming-soon" className="button secondary">
            Join the waitlist <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <p className="fixture-note centered">
          Concept preview · No membership, payment or gym partnership is live
        </p>
      </section>

      <div className="feed-layout">
        <div className="feed-main">
          <div className="feed-section-heading">
            <h2>Around your club</h2>
            <div className="segment" aria-label="Feed filter">
              {["For you", "Following"].map((option) => (
                <button
                  key={option}
                  aria-pressed={filter === option}
                  className={filter === option ? "selected" : ""}
                  onClick={() => {
                    if (option === "Following" && !requestPrivateAccess())
                      return;
                    setFilter(option);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="activity-list">
            {visibleCheckins.map((item) => {
              const person = people.find(
                (candidate) => candidate.id === item.personId,
              );
              if (!person) return null;
              return (
                <article className="activity-card" key={item.personId}>
                  <div className="activity-person">
                    <Avatar initials={item.initials} color={item.color} />
                    <div>
                      <p>
                        <Link href={`/users/${person.id}`}>
                          <strong>{person.name}</strong>
                        </Link>{" "}
                        shared a gym check-in
                      </p>
                      <small>Demo activity · Shared by the member</small>
                    </div>
                    <Pill tone="subtle">
                      <Check size={12} aria-hidden="true" />
                      Check-in
                    </Pill>
                  </div>
                  <div className="activity-session">
                    <span className="session-icon">
                      <Footprints size={25} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{item.gym}</h3>
                      <p>
                        {item.area} · {item.detail}
                      </p>
                    </div>
                    <Link
                      href={`/explore?q=${encodeURIComponent(item.gym)}`}
                      className="circle-link"
                      aria-label={`View ${item.gym}`}
                    >
                      <ArrowUpRight size={20} aria-hidden="true" />
                    </Link>
                  </div>
                  <p className="activity-caption">
                    Participation appears in the community only when the member
                    explicitly shares it.
                  </p>
                  <Link
                    className="text-link"
                    href={`/explore?q=${encodeURIComponent(item.gym)}`}
                  >
                    View gym <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
            {!visibleCheckins.length && (
              <Empty
                title="Your people, your feed."
                description="Follow a few club members to see the demo check-ins they choose to share."
                href="/explore"
                action="Explore gyms"
              />
            )}
          </div>
        </div>

        <aside className="feed-rail">
          <section className="club-discovery" aria-label="Local gym discovery">
            <SectionTitle
              title="Find your next gym"
              href="/explore"
              action="All gyms"
            />
            <p className="fixture-note">
              Illustrative gyms · No partnership claimed
            </p>
            {studios
              .filter(
                (studio) =>
                  studio.id === "fabrik" || studio.id === "northside-combat",
              )
              .map((studio) => (
                <Link
                  key={studio.id}
                  href={`/explore?q=${encodeURIComponent(studio.name)}`}
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
                          ? "Illustrative sunlit strength gym with weights and plants"
                          : "Illustrative martial arts gym with punching bags and training mats"
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
                      Explore gym <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
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
                      <Check size={15} aria-hidden="true" />
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
