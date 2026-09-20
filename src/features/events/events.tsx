"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  MapPin,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import { formatEurc } from "@/lib/fixtures";
import {
  eventDate,
  eventFromDraft,
  validateEventDraft,
  type ClubEvent,
  type EventDraftInput,
} from "@/lib/events";
import { useDemo } from "@/lib/store";
import { Artwork, Empty, Modal, Pill } from "@/components/ui";
import { CopyLink, RelatedActivities } from "@/components/discovery-extras";

export function EventDetail({
  event,
  draft = false,
}: {
  event: ClubEvent;
  draft?: boolean;
}) {
  const { dispatch } = useDemo();
  const router = useRouter();
  const [dialog, setDialog] = useState<"ticket" | "delete" | null>(null);
  return (
    <>
      <Link href="/explore?view=events" className="back-link">
        <ArrowLeft size={16} />
        Explore events
      </Link>
      <div className="detail-layout">
        <div>
          <div className="detail-art">
            <Artwork
              kind={
                event.discipline === "Running"
                  ? "run"
                  : event.discipline === "Strength"
                    ? "strength"
                    : event.discipline === "Muay Thai"
                      ? "fight"
                      : "flow"
              }
              large
            />
            <span className="art-pill">
              <Pill tone="white">
                <Coffee size={13} />
                Social event · {event.discipline}
              </Pill>
            </span>
          </div>
          <div className="detail-title">
            <span className="eyebrow">
              HOSTED BY {event.host.toUpperCase()}
            </span>
            <h1>{event.title}</h1>
            <p>
              <MapPin size={15} />
              {event.location}
            </p>
          </div>
          <p className="detail-description">{event.description}</p>
          <div className="detail-metadata">
            <span>
              <CalendarDays size={20} />
              <strong>{eventDate(event.dateISO)}</strong>
              <small>{event.time} · Berlin time</small>
            </span>
            <span>
              <Clock3 size={20} />
              <strong>{event.duration} minutes</strong>
              <small>Time together</small>
            </span>
            <span>
              <Users size={20} />
              <strong>{event.capacity} places</strong>
              <small>{draft ? "Planned capacity" : "Example capacity"}</small>
            </span>
          </div>
          <section className="detail-section">
            <h2>Included with every ticket</h2>
            <div className="event-benefit">
              <Coffee size={24} />
              <p>{event.included}</p>
            </div>
            <p>
              Everyone with a valid ticket gets the included experience. No
              winner, voting or prize pool.
            </p>
          </section>
          <section className="detail-section">
            <h2>How your ticket will work</h2>
            <div className="rule-item">
              <Ticket size={20} />
              <div>
                <strong>One ticket. One redemption.</strong>
                <p>
                  Show your ticket to the host when collecting what’s included.
                  The host will mark it used once; a used ticket cannot be
                  redeemed again.
                </p>
              </div>
            </div>
            <div className="rule-item">
              <Users size={20} />
              <div>
                <strong>A social meetup, with its own attendance.</strong>
                <p>
                  Buying or redeeming an event ticket won’t increase your
                  gym-confirmed visit count.
                </p>
              </div>
            </div>
            <p className="small-copy">
              Ticket issuance and authorized host redemption are planned. This
              preview cannot issue or redeem a ticket.
            </p>
          </section>
        </div>
        <aside className="detail-aside">
          <section className="rail-card entry-card">
            <span className="eyebrow">
              {draft ? "YOUR EVENT DRAFT" : "YOUR TIME TOGETHER"}
            </span>
            {draft && <Pill tone="amber">Saved locally · Not published</Pill>}
            <div className="class-detail-price">
              <strong>{formatEurc(event.price)}</strong>
              <span>test EURC / one ticket</span>
            </div>
            <div className="line-item">
              <span>Paid to</span>
              <strong>{event.host}</strong>
            </div>
            <div className="notice">
              <strong>Included for everyone</strong>
              <p>{event.included}</p>
            </div>
            {draft ? (
              <>
                <p className="fixture-note">
                  Saved only in this browser. No published event, ticket or
                  payment. A host name does not verify host authority.
                </p>
                <button
                  className="button secondary full"
                  onClick={() => setDialog("delete")}
                >
                  <Trash2 size={16} />
                  Delete event draft
                </button>
              </>
            ) : (
              <>
                <button
                  className="button lime full"
                  onClick={() => setDialog("ticket")}
                >
                  Preview ticket <ArrowRight size={18} />
                </button>
                <CopyLink path={`/events/${event.id}`} />
                <p className="fixture-note centered">
                  Illustrative event and café. No live availability or
                  partnership. No payment submitted.
                </p>
              </>
            )}
            <p className="small-copy">
              Event cancellation and refund terms must be finalized and shown
              before paid publication. No purchase is available yet.
            </p>
          </section>
        </aside>
      </div>
      {!draft && (
        <RelatedActivities
          activity={event.discipline}
          path={`/events/${event.id}`}
        />
      )}
      {dialog === "ticket" && (
        <Modal
          title={`Your ${event.title} ticket`}
          onClose={() => setDialog(null)}
        >
          <p className="dialog-copy">
            {event.title} · {eventDate(event.dateISO)} · {event.time}
          </p>
          <div className="checkout-summary">
            <div className="line-item">
              <span>One ticket</span>
              <strong>{formatEurc(event.price)} test EURC</strong>
            </div>
            <div className="line-item">
              <span>Paid to the host</span>
              <strong>{event.host}</strong>
            </div>
          </div>
          <h3>Included with your ticket</h3>
          <p className="dialog-copy">{event.included}</p>
          <div className="notice">
            <strong>Ticket checkout isn’t connected yet.</strong>
            <p>
              No payment, reservation or ticket has been created. Devnet
              purchase and single-use host redemption will be connected in the
              payment phase.
            </p>
          </div>
          <button className="button dark full" onClick={() => setDialog(null)}>
            Back to event <ArrowRight size={17} />
          </button>
        </Modal>
      )}
      {dialog === "delete" && (
        <Modal title="Delete this event draft?" onClose={() => setDialog(null)}>
          <p className="dialog-copy">
            Remove “{event.title}” from this browser? No published event or
            funds are affected.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setDialog(null)}
            >
              Keep draft
            </button>
            <button
              className="button dark"
              onClick={() => {
                dispatch({ type: "delete-event-draft", id: event.id });
                router.push("/explore?view=events");
              }}
            >
              Delete event draft
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

export function EventDraftDetail({ id }: { id: string }) {
  const { state } = useDemo();
  const draft = state.eventDrafts.find((item) => item.id === id);
  if (!draft)
    return (
      <Empty
        title="This event draft isn’t here."
        description="Drafts stay in the browser where you create them. It may have been deleted or saved elsewhere."
        href="/events/new"
        action="Create an event"
      />
    );
  return <EventDetail event={eventFromDraft(draft)} draft />;
}

export function CreateEvent() {
  const router = useRouter();
  const { dispatch } = useDemo();
  const [input, setInput] = useState<EventDraftInput>({
    title: "",
    host: "",
    location: "",
    description: "",
    included: "",
    discipline: "Running",
    dateISO: "2026-09-27",
    time: "09:00",
    duration: "90",
    capacity: "12",
    price: "2",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set(key: keyof EventDraftInput, value: string) {
    setInput((old) => ({ ...old, [key]: value }));
    setErrors((old) => {
      const next = { ...old };
      delete next[key];
      return next;
    });
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const issues = validateEventDraft(input);
    setErrors(issues);
    if (Object.keys(issues).length) {
      document.getElementById(`event-${Object.keys(issues)[0]}`)?.focus();
      return;
    }
    const id = `event-draft-${crypto.randomUUID()}`;
    dispatch({
      type: "event-draft",
      draft: {
        ...input,
        title: input.title.trim(),
        host: input.host.trim(),
        location: input.location.trim(),
        description: input.description.trim(),
        included: input.included.trim(),
        id,
        createdAt: new Date().toISOString(),
      },
    });
    router.push(`/events/${id}`);
  }
  function field(
    key: keyof EventDraftInput,
    label: string,
    type = "text",
    placeholder?: string,
  ) {
    const props = {
      id: `event-${key}`,
      value: input[key],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => set(key, e.target.value),
      "aria-invalid": !!errors[key],
      "aria-describedby": errors[key] ? `event-${key}-error` : undefined,
    };
    return (
      <div className="field">
        <label htmlFor={props.id}>{label}</label>
        {type === "textarea" ? (
          <textarea
            {...props}
            rows={3}
            maxLength={key === "included" ? 600 : 1200}
            placeholder={placeholder}
          />
        ) : (
          <input
            {...props}
            type={type === "decimal" ? "text" : type}
            inputMode={
              type === "decimal"
                ? "decimal"
                : type === "number"
                  ? "numeric"
                  : undefined
            }
            placeholder={placeholder}
            maxLength={key === "location" ? 160 : 80}
          />
        )}
        {errors[key] && (
          <span className="field-error" id={`event-${key}-error`}>
            {errors[key]}
          </span>
        )}
      </div>
    );
  }
  return (
    <>
      <Link href="/explore?view=events" className="back-link">
        <ArrowLeft size={16} />
        Explore events
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">AN EXPERIENCE FOR EVERYONE</span>
          <h1>
            Make a little plan<span className="lime-text">.</span>
          </h1>
          <p>
            Bring people together. Give every ticket something to look forward
            to.
          </p>
        </div>
        <Pill tone="amber">Local draft</Pill>
      </div>
      <form className="creation-layout" noValidate onSubmit={submit}>
        <div className="form-card">
          <fieldset>
            <legend>
              <span>01</span>The people and the plan.
            </legend>
            {field("title", "Event name", "text", "e.g. Run & Coffee")}
            {field("host", "Host name", "text", "e.g. Sunday Coffee")}
            {field(
              "location",
              "Meeting point",
              "text",
              "Where should everyone meet?",
            )}
            <div className="field">
              <label htmlFor="event-discipline">Activity</label>
              <select
                id="event-discipline"
                value={input.discipline}
                onChange={(e) => set("discipline", e.target.value)}
              >
                {["Running", "Strength", "Muay Thai", "Yoga"].map(
                  (activity) => (
                    <option key={activity}>{activity}</option>
                  ),
                )}
              </select>
            </div>
            {field(
              "description",
              "What’s the plan?",
              "textarea",
              "Describe the route, pace and who is welcome.",
            )}
          </fieldset>
          <fieldset>
            <legend>
              <span>02</span>Make the ticket worthwhile.
            </legend>
            {field(
              "included",
              "Included with every ticket",
              "textarea",
              "e.g. A social 5K and one regular coffee afterwards.",
            )}
            {field("price", "Ticket price (test EURC)", "decimal")}
            <p className="small-copy">
              Paid to the host for the included experience. Every ticket holder
              gets the benefit; there is no prize pool or winner.
            </p>
          </fieldset>
          <fieldset>
            <legend>
              <span>03</span>A time and a place for everyone.
            </legend>
            <div className="form-columns">
              {field("dateISO", "Event date", "date")}
              {field("time", "Start time (Berlin)", "time")}
            </div>
            <div className="form-columns">
              {field("duration", "Duration (minutes)", "number")}
              {field("capacity", "Number of places", "number")}
            </div>
            <p className="small-copy">
              Planning dates can be in the past. Publication will recheck future
              availability and the final refund terms.
            </p>
          </fieldset>
          <button className="button dark full" type="submit">
            Save event draft <ArrowRight size={18} />
          </button>
        </div>
        <aside className="creation-aside">
          <div className="draft-preview">
            <span className="eyebrow">YOUR EVENT, TAKING SHAPE</span>
            <span className="preview-spark">
              <Coffee size={42} />
            </span>
            <Pill tone="white">Social event</Pill>
            <h2>{input.title || "A run. A coffee. Your people."}</h2>
            <p>
              {input.included || "Something included for every ticket holder."}
            </p>
            <div className="preview-price">
              <strong>
                {Number.isFinite(Number(input.price))
                  ? formatEurc(Number(input.price))
                  : "€—"}
              </strong>
              <span>test EURC / ticket</span>
            </div>
          </div>
          <div className="notice">
            <strong>Plan it here. Save it locally.</strong>
            <p>
              This draft stays in your browser. Saving does not publish an
              event, take payments or issue tickets. Host verification, refund
              terms and ticket redemption come before paid publication.
            </p>
          </div>
          <div className="form-checklist">
            <span>
              <Check size={15} />
              An included benefit for everyone
            </span>
            <span>
              <Check size={15} />
              No winner or voting
            </span>
            <span>
              <Check size={15} />
              No wallet needed to draft
            </span>
          </div>
        </aside>
      </form>
    </>
  );
}
