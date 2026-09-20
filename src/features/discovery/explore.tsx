"use client";
import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Coffee,
  X,
} from "lucide-react";
import { classes, studios, events } from "@/features/preview/catalogue";
import type { ClubClass, ClubStudio } from "@/domain/catalogue";
import { formatEurc } from "@/components/format";
import { filterClasses, filterStudios } from "@/features/discovery/filters";
import type { ActivityFilter, TimeFilter } from "@/domain/discovery";
import { Artwork, Empty, Modal, Pill } from "@/components/ui";

import {
  ActivityControl,
  ScheduleControls,
} from "@/components/discovery-filters";
import { EventList } from "@/features/discovery/event-list";

export type ExploreView = "classes" | "events" | "studios";
const views: ExploreView[] = ["classes", "events", "studios"];

function ClassCard({ session }: { session: ClubClass }) {
  return (
    <article className="class-card">
      <Link
        className="class-art"
        href={`/classes/${session.id}`}
        aria-label={`View ${session.title}`}
      >
        <Artwork kind={session.artwork} />
        <span className="art-pill">
          <Pill tone="white">{session.discipline}</Pill>
        </span>
        <span className="class-spots">{session.spots} spots left · demo</span>
      </Link>
      <div className="class-content">
        <div className="class-location">
          <MapPin size={13} />
          {session.gym} · {session.area}
        </div>
        <Link href={`/classes/${session.id}`}>
          <h2>{session.title}</h2>
        </Link>
        <p className="meta-line">
          <Clock3 size={14} />
          {session.day}, {session.date} · {session.time} · {session.duration}{" "}
          min
        </p>
        <div className="class-card-bottom">
          <div>
            <strong>{formatEurc(session.price)}</strong>
            <small>test EURC / class</small>
          </div>
          <Link
            href={`/classes/${session.id}`}
            className="circle-link"
            aria-label={`Open ${session.title}`}
          >
            <ArrowUpRight size={21} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function StudioCard({
  studio,
  onOpen,
}: {
  studio: ClubStudio;
  onOpen: () => void;
}) {
  return (
    <article className="studio-card">
      <button
        className="studio-art"
        onClick={onOpen}
        aria-label={`View ${studio.name}`}
      >
        <Artwork kind={studio.artwork} />
        <span className="art-pill">
          <Pill tone="white">
            <Building2 size={12} />
            Studio
          </Pill>
        </span>
      </button>
      <div className="studio-content">
        <span className="class-location">
          <MapPin size={13} />
          {studio.area}, Berlin
        </span>
        <h2>{studio.name}</h2>
        <div className="studio-activities">
          {studio.activities.map((activity) => (
            <Pill key={activity}>{activity}</Pill>
          ))}
        </div>
        <p>{studio.description}</p>
        <button className="text-link studio-link" onClick={onOpen}>
          View studio <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}

function StudioDetails({
  studio,
  onClose,
}: {
  studio: ClubStudio;
  onClose: () => void;
}) {
  const schedule = classes.filter((session) => session.gymId === studio.id);
  return (
    <Modal title={studio.name} onClose={onClose}>
      <p className="studio-dialog-location">
        <MapPin size={15} />
        {studio.area}, Berlin <span>· Demo studio</span>
      </p>
      <div className="studio-activities">
        {studio.activities.map((activity) => (
          <Pill key={activity} tone="lime">
            {activity}
          </Pill>
        ))}
      </div>
      <p className="dialog-copy">{studio.description}</p>
      <div className="studio-coach">
        <strong>Your coach{studio.coaches.length === 1 ? "" : "es"}</strong>
        <span>{studio.coaches.join(", ")}</span>
      </div>
      <h3 className="studio-schedule-heading">Classes at this studio</h3>
      <p className="small-copy">Demo schedule · September 2026 · Berlin time</p>
      <div className="studio-schedule">
        {schedule.map((session) => (
          <Link
            key={session.id}
            href={`/classes/${session.id}`}
            className="studio-session"
          >
            <span className="date-block">
              <small>{session.day}</small>
              <strong>{session.date.split(" ")[0]}</strong>
            </span>
            <span>
              <strong>{session.title}</strong>
              <small>
                {session.date} · {session.time} · {session.duration} min
              </small>
            </span>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
      {!schedule.length && (
        <p className="notice">No classes in this demo schedule yet.</p>
      )}
      <p className="fixture-note">
        Illustrative venue and schedule. No live availability or partnership is
        claimed.
      </p>
    </Modal>
  );
}

export function Explore({
  initialQuery = "",
  initialView = "classes",
}: {
  initialQuery?: string;
  initialView?: ExploreView;
}) {
  const [view, setView] = useState<ExploreView>(initialView);
  const [query, setQuery] = useState(initialQuery);
  const [classActivity, setClassActivity] = useState<ActivityFilter>("all");
  const [studioActivity, setStudioActivity] = useState<ActivityFilter>("all");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeFilter>("any");
  const [studio, setStudio] = useState<ClubStudio | null>(null);
  const classResults = filterClasses(classes, {
    activity: classActivity,
    date,
    time,
    query,
  });
  const studioResults = filterStudios(studios, {
    activity: studioActivity,
    query,
  });
  const classFiltered =
    classActivity !== "all" || !!date || time !== "any" || !!query.trim();
  const studioFiltered = studioActivity !== "all" || !!query.trim();
  function resetClasses() {
    setClassActivity("all");
    setDate("");
    setTime("any");
    setQuery("");
  }
  function resetStudios() {
    setStudioActivity("all");
    setQuery("");
  }
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? views[0]
        : event.key === "End"
          ? views[views.length - 1]
          : views[
              (views.indexOf(view) +
                (event.key === "ArrowRight" ? 1 : views.length - 1)) %
                views.length
            ];
    setView(next);
    document.getElementById(`explore-tab-${next}`)?.focus();
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">A CITY FULL OF POSSIBILITIES</span>
          <h1>
            Find your next move<span className="lime-text">.</span>
          </h1>
          <p>
            Find a class, a shared experience or a studio that feels like you.
          </p>
        </div>
        <Pill>
          <MapPin size={14} />
          Berlin
        </Pill>
      </div>
      <div
        className="explore-tabs"
        role="tablist"
        aria-label="Explore categories"
      >
        {views.map((tab) => {
          const Icon =
            tab === "classes"
              ? CalendarDays
              : tab === "events"
                ? Coffee
                : Building2;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`explore-tab-${tab}`}
              aria-selected={view === tab}
              aria-controls={`explore-panel-${tab}`}
              tabIndex={view === tab ? 0 : -1}
              onClick={() => setView(tab)}
              onKeyDown={navigateTabs}
            >
              <Icon size={18} aria-hidden="true" />
              {tab === "classes"
                ? "Classes"
                : tab === "events"
                  ? "Events"
                  : "Studios"}
              <span aria-hidden="true">
                {tab === "classes"
                  ? classes.length
                  : tab === "events"
                    ? events.length
                    : studios.length}
              </span>
            </button>
          );
        })}
      </div>
      {!!query.trim() && (
        <div className="explore-search-context">
          <span>
            Results for <strong>“{query.trim()}”</strong>
          </span>
          <button
            className="text-link"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            Clear search <X size={14} />
          </button>
        </div>
      )}
      <section
        id="explore-panel-classes"
        role="tabpanel"
        aria-labelledby="explore-tab-classes"
        hidden={view !== "classes"}
      >
        <div className="discovery-filters">
          <ActivityControl
            id="class-activity"
            value={classActivity}
            onChange={setClassActivity}
          />
          <ScheduleControls
            prefix="class"
            date={date}
            time={time}
            onDate={setDate}
            onTime={setTime}
          />
          {classFiltered && (
            <button className="text-link reset-filters" onClick={resetClasses}>
              Reset filters <X size={14} />
            </button>
          )}
        </div>
        <div className="results-label" aria-live="polite">
          <strong>
            {classResults.length}{" "}
            {classResults.length === 1 ? "class" : "classes"} to make your week
          </strong>
          <span id="class-schedule-note">
            Demo schedule · September 2026 · Berlin time
          </span>
        </div>
        <div className="class-grid">
          {classResults.map((session) => (
            <ClassCard key={session.id} session={session} />
          ))}
        </div>
        {!classResults.length && (
          <div className="discovery-empty">
            <Empty
              title="A little change of pace?"
              description="No classes match your activity, date and time. Try another combination or browse all demo classes."
            />
            <button className="button secondary" onClick={resetClasses}>
              Show all classes <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
      <section
        id="explore-panel-events"
        role="tabpanel"
        aria-labelledby="explore-tab-events"
        hidden={view !== "events"}
      >
        <EventList query={query} clearQuery={() => setQuery("")} />
      </section>
      <section
        id="explore-panel-studios"
        role="tabpanel"
        aria-labelledby="explore-tab-studios"
        hidden={view !== "studios"}
      >
        <div className="discovery-filters studios-filters">
          <ActivityControl
            id="studio-activity"
            value={studioActivity}
            onChange={setStudioActivity}
          />
          {studioFiltered && (
            <button className="text-link reset-filters" onClick={resetStudios}>
              Reset filters <X size={14} />
            </button>
          )}
        </div>
        <div className="results-label" aria-live="polite">
          <strong>
            {studioResults.length}{" "}
            {studioResults.length === 1 ? "studio" : "studios"} to find your
            people
          </strong>
          <span>Discover a space. Find your community.</span>
        </div>
        <div className="studio-grid">
          {studioResults.map((item) => (
            <StudioCard
              key={item.id}
              studio={item}
              onOpen={() => setStudio(item)}
            />
          ))}
        </div>
        {!studioResults.length && (
          <div className="discovery-empty">
            <Empty
              title="Your next space is out there."
              description="No demo studios match this activity or search. Browse all three spaces to find a place to start."
            />
            <button className="button secondary" onClick={resetStudios}>
              Show all studios <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
      <p className="catalogue-note">
        A curated demo catalogue. These are illustrative venues and schedules,
        not live availability or claimed partnerships.
      </p>
      {studio && (
        <StudioDetails studio={studio} onClose={() => setStudio(null)} />
      )}
    </>
  );
}
