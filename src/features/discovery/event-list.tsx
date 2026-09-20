"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Coffee,
  MapPin,
  Plus,
  Ticket,
} from "lucide-react";
import {
  ActivityControl,
  ScheduleControls,
} from "@/components/discovery-filters";
import { Artwork, Empty, Pill } from "@/components/ui";
import { events, eventDate } from "@/lib/events";
import {
  filterEvents,
  type ActivityFilter,
  type TimeFilter,
} from "@/lib/explore";
import { formatEurc } from "@/lib/fixtures";
import { useDemo } from "@/lib/store";

export function EventList({
  query,
  clearQuery,
}: {
  query: string;
  clearQuery: () => void;
}) {
  const { state } = useDemo();
  const [activity, setActivity] = useState<ActivityFilter>("all");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<TimeFilter>("any");
  const results = filterEvents(events, { activity, date, time, query });

  function reset() {
    setActivity("all");
    setDate("");
    setTime("any");
    clearQuery();
  }

  return (
    <>
      <div className="discovery-filters">
        <ActivityControl
          id="event-activity"
          value={activity}
          onChange={setActivity}
        />
        <ScheduleControls
          prefix="event"
          date={date}
          time={time}
          onDate={setDate}
          onTime={setTime}
        />
        {(activity !== "all" || date || time !== "any" || query.trim()) && (
          <button className="text-link reset-filters" onClick={reset}>
            Reset filters
          </button>
        )}
      </div>
      <div className="results-label" aria-live="polite">
        <strong>
          {results.length} {results.length === 1 ? "event" : "events"} to share
          a little time
        </strong>
        <span id="event-schedule-note">
          Demo schedule · September 2026 · Berlin time
        </span>
      </div>
      <div className="class-grid">
        {results.map((event) => (
          <article className="event-card" key={event.id}>
            <Link
              className="class-art"
              href={`/events/${event.id}`}
              aria-label={`View ${event.title}`}
            >
              <Artwork kind="run" />
              <span className="art-pill">
                <Pill tone="white">
                  <Coffee size={13} />
                  Social event · {event.discipline}
                </Pill>
              </span>
            </Link>
            <div className="class-content">
              <span className="class-location">
                <MapPin size={13} />
                {event.host} · Berlin
              </span>
              <Link href={`/events/${event.id}`}>
                <h2>{event.title}</h2>
              </Link>
              <p className="meta-line">
                <Clock3 size={14} />
                {eventDate(event.dateISO)} · {event.time}
              </p>
              <p className="event-inclusion">
                <Coffee size={16} />A social 5K + one coffee for every ticket
                holder.
              </p>
              <div className="class-card-bottom">
                <div>
                  <strong>{formatEurc(event.price)}</strong>
                  <small>test EURC / ticket</small>
                </div>
                <Link
                  href={`/events/${event.id}`}
                  className="circle-link"
                  aria-label={`Open ${event.title}`}
                >
                  <ArrowUpRight size={21} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="discovery-empty">
          <Empty
            title="Another day, another good plan."
            description="No events match this activity, date, time or search. Try the full demo schedule."
          />
          <button className="button secondary" onClick={reset}>
            Show all events <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="creator-callout event-creator-callout">
        <Coffee size={28} />
        <div>
          <h2>Good company is the occasion.</h2>
          <p>
            Host a run, a meetup or a little adventure. Include something for
            everyone.
          </p>
        </div>
        <Link href="/events/new" className="button secondary">
          Create event <Plus size={17} />
        </Link>
      </div>
      {state.eventDrafts.length > 0 && (
        <section aria-label="Your event drafts">
          <h2 className="studio-schedule-heading">Your event drafts</h2>
          <div className="draft-list">
            {state.eventDrafts.map((draft) => (
              <Link
                className="draft-row"
                href={`/events/${draft.id}`}
                key={draft.id}
              >
                <span className="session-icon">
                  <Ticket size={22} />
                </span>
                <div>
                  <h3>{draft.title}</h3>
                  <p>
                    {draft.host} · {formatEurc(Number(draft.price))} test EURC /
                    ticket
                  </p>
                </div>
                <Pill tone="amber">Local draft</Pill>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
