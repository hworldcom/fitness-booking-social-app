"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  Flag,
  Check,
  CalendarDays,
  ShieldCheck,
  Bookmark,
  Trash2,
  Coins,
  Trophy,
  Coffee,
  Search,
  ArrowDownWideNarrow,
} from "lucide-react";
import {
  discoverChallenges,
  challengeDate,
  type ChallengeSort,
} from "@/lib/discovery";
import type { ActivityFilter } from "@/lib/explore";
import { ActivityControl } from "./discovery-filters";
import { CopyLink, RelatedActivities } from "./discovery-extras";
import { challenges, formatEurc, type ClubChallenge } from "@/lib/fixtures";
import { type DraftInput, validateDraft } from "@/lib/demo";
import { useDemo } from "@/lib/store";
import { Artwork, AvatarStack, ChallengeCard, Empty, Modal, Pill } from "./ui";

export function ChallengeList({
  initialQuery = "",
  initialMode = "all",
}: {
  initialQuery?: string;
  initialMode?: "all" | "community" | "sponsored";
}) {
  const [filter, setFilter] = useState(
    initialMode === "community"
      ? "Community"
      : initialMode === "sponsored"
        ? "Sponsored"
        : "All challenges",
  );
  const [query, setQuery] = useState(initialQuery);
  const [activity, setActivity] = useState<ActivityFilter>("all");
  const [sort, setSort] = useState<ChallengeSort>("starting");
  const { state } = useDemo();
  const visible = discoverChallenges(
    filter === "Saved"
      ? challenges.filter((c) => state.saved.includes(c.id))
      : challenges,
    {
      query,
      activity,
      sort,
      mode:
        filter === "Community"
          ? "community"
          : filter === "Sponsored"
            ? "sponsored"
            : "all",
    },
  );
  const filtered =
    !!query.trim() ||
    activity !== "all" ||
    filter === "Community" ||
    filter === "Sponsored";
  function reset() {
    setQuery("");
    setActivity("all");
    setFilter("All challenges");
    setSort("starting");
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">SMALL COMMITMENTS. REAL CONNECTIONS.</span>
          <h1>
            A reason to show up<span className="lime-text">.</span>
          </h1>
          <p>
            Your community, your challenge. A little motivation goes a long way.
          </p>
        </div>
        <Link href="/challenges/new" className="button dark">
          <Plus size={18} />
          Create challenge
        </Link>
      </div>
      <p className="challenge-intro-compact">
        Pool a little together, or let a creator sponsor the prize.{" "}
        <Link href="/how-it-works">
          How it works <ArrowRight size={14} />
        </Link>
      </p>
      <div className="chips" aria-label="Challenge filter">
        {["All challenges", "Community", "Sponsored", "Saved", "My drafts"].map(
          (f) => (
            <button
              className={`chip ${filter === f ? "active" : ""}`}
              aria-pressed={filter === f}
              key={f}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "My drafts" && state.drafts.length > 0 && (
                <span className="chip-count">{state.drafts.length}</span>
              )}
            </button>
          ),
        )}
      </div>
      {filter === "My drafts" ? (
        <DraftList />
      ) : (
        <>
          <div className="discovery-filters challenge-discovery-filters">
            <div className="discovery-filter challenge-query">
              <label htmlFor="challenge-search">
                <Search size={14} />
                Search challenges
              </label>
              <input
                id="challenge-search"
                type="search"
                value={query}
                maxLength={200}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Activity, title or organizer"
              />
            </div>
            <ActivityControl
              id="challenge-activity"
              value={activity}
              onChange={setActivity}
            />
            <div className="discovery-filter">
              <label htmlFor="challenge-sort">
                <ArrowDownWideNarrow size={14} />
                Sort by
              </label>
              <select
                id="challenge-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as ChallengeSort)}
              >
                <option value="starting">Starting soon</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            {(filtered || sort !== "starting") && (
              <button className="text-link reset-filters" onClick={reset}>
                Reset filters
              </button>
            )}
          </div>
          <div className="results-label">
            <strong>{visible.length} ways to move together</strong>
            <span>Example pools · No funds deposited</span>
          </div>
          <div className="challenge-grid">
            {visible.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
          {!visible.length && (
            <Empty
              title={
                filter === "Saved" && !filtered
                  ? "Save a little inspiration."
                  : "No challenges match yet."
              }
              description={
                filter === "Saved" && !filtered
                  ? "Tap the bookmark on a challenge to keep it here for later."
                  : "Try another activity or organizer, or reset the filters to see all examples."
              }
            />
          )}
        </>
      )}
      <div className="creator-callout">
        <Flag size={28} strokeWidth={1.4} />
        <div>
          <h2>Your people. Your rules. Your challenge.</h2>
          <p>
            Friends, trainers, gyms and organizations all start in the same
            place.
          </p>
        </div>
        <Link href="/challenges/new" className="button secondary">
          Make it happen <ArrowRight size={17} />
        </Link>
      </div>
      <div className="event-discovery-link">
        <Coffee size={20} />
        <p>
          Just getting together? Host an event with something included for
          everyone.
        </p>
        <Link href="/explore?view=events" className="text-link">
          Explore events <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
export function DraftList() {
  const { state } = useDemo();
  if (!state.drafts.length)
    return (
      <Empty
        title="Every club starts with an idea."
        description="Create your first challenge draft. No wallet or funding needed to plan it."
        href="/challenges/new"
        action="Create a draft"
      />
    );
  return (
    <div className="draft-list">
      {state.drafts.map((draft) => (
        <Link
          className="draft-row"
          key={draft.id}
          href={`/challenges/${draft.id}`}
        >
          <span className="session-icon">
            <Flag size={22} />
          </span>
          <div>
            <h3>{draft.title}</h3>
            <p>
              {draft.discipline} ·{" "}
              {draft.mode === "community" ? "Community" : "Sponsored"} ·{" "}
              {formatEurc(Number(draft.amount))} test EURC
            </p>
          </div>
          <Pill tone="amber">Draft · Not funded</Pill>
          <ArrowRight size={18} />
        </Link>
      ))}
    </div>
  );
}
export function ChallengeDetail({ challenge }: { challenge: ClubChallenge }) {
  const { state, dispatch } = useDemo();
  const [review, setReview] = useState(false);
  const saved = state.saved.includes(challenge.id);
  return (
    <>
      <Link href="/challenges" className="back-link">
        <ArrowLeft size={16} />
        All challenges
      </Link>
      <div className="detail-layout">
        <div>
          <div className="detail-art">
            <Artwork kind={challenge.artwork} large />
            <span className="art-pill">
              <Pill tone="white">{challenge.discipline}</Pill>
            </span>
          </div>
          <div className="detail-title">
            <Pill tone="lime">
              {challenge.mode === "community" ? (
                <Users size={13} />
              ) : (
                <Zap size={13} />
              )}
              {challenge.mode === "community"
                ? "Community challenge"
                : "Sponsored challenge"}
            </Pill>
            <h1>{challenge.title}</h1>
            <p>Created by {challenge.organizer} · Demonstration fixture</p>
          </div>
          <p className="detail-description">{challenge.description}</p>
          <div className="detail-metadata">
            <span>
              <CalendarDays size={19} />
              <strong>{challenge.date}</strong>
              <small>September 2026</small>
            </span>
            <span>
              <Users size={19} />
              <strong>
                {challenge.participants} / {challenge.capacity} people
              </strong>
              <small>A small, supportive group</small>
            </span>
            <span>
              <Flag size={19} />
              <strong>{challenge.duration}</strong>
              <small>One shared commitment</small>
            </span>
          </div>
          <section className="detail-section challenge-summary">
            <h2>Your challenge at a glance</h2>
            <dl className="rules-summary">
              <div>
                <dt>What do I do?</dt>
                <dd>{challenge.rules}</dd>
              </div>
              <div>
                <dt>Entry and prize</dt>
                <dd>
                  {challenge.entry
                    ? `${formatEurc(challenge.entry)} test EURC per participant`
                    : "Free entry in this example (proposed demo terms)"}
                  . Example pool: {formatEurc(challenge.prize)} test EURC, not
                  funded. A prize is not guaranteed for completing the activity.
                </dd>
              </div>
              <div>
                <dt>Who decides?</dt>
                <dd>
                  {challenge.mode === "community"
                    ? "Registered participants vote. At least 50% must cast a vote; this is turnout, not the votes one candidate needs."
                    : "The organizer chooses a winner under the published challenge rules."}
                </dd>
              </div>
              <div>
                <dt>When is the decision due?</dt>
                <dd>
                  {challengeDate(challenge.startDate)}–
                  {challengeDate(challenge.endDate)} is the example activity
                  period.{" "}
                  {challenge.mode === "community"
                    ? "Voting opens after the end. A 24-hour voting window is proposed and must be finalized before entry."
                    : "The organizer must choose within 24 hours after the challenge ends."}
                </dd>
              </div>
              <div>
                <dt>If no decision is made?</dt>
                <dd>
                  {challenge.mode === "community"
                    ? "If turnout is below 50% at the voting deadline, the pool is shared evenly among participants."
                    : "If the organizer does not choose within 24 hours, the pool is shared evenly among participants."}{" "}
                  Cancelling before the start returns funds to their original
                  contributors.
                </dd>
              </div>
            </dl>
          </section>
          {challenge.award && (
            <section
              className="detail-section challenge-award"
              aria-label="Winner and prize"
            >
              <Pill tone="lime">
                <Trophy size={14} />
                {challenge.award.summary}
              </Pill>
              <h2>How to win</h2>
              <p>{challenge.award.criteria}</p>
              <h3>Who chooses the winner?</h3>
              <p>{challenge.award.selection}</p>
              <h3>What does the winner receive?</h3>
              <p>{challenge.award.prize}</p>
              <p className="fixture-note">
                Illustrative rules and prize. No winner has been selected and no
                funds have been deposited or paid.
              </p>
            </section>
          )}
          <details className="detail-section extended-rules">
            <summary>Full participation and cancellation terms</summary>
            <div className="rule-item">
              <ShieldCheck size={20} />
              <div>
                <strong>
                  {challenge.mode === "community"
                    ? "Your community has a say"
                    : "Your organizer chooses"}
                </strong>
                <p>
                  {challenge.mode === "community"
                    ? "At least half of registered participants must vote. If turnout is below 50% at the deadline, the pool is split evenly among participants."
                    : "The organizer has 24 hours after the challenge ends to choose a winner. If they don’t, the pool is split evenly among participants."}
                </p>
              </div>
            </div>
            <div className="rule-item">
              <Coins size={20} />
              <div>
                <strong>Funds have a clear destination</strong>
                <p>
                  Challenge funds will stay in a dedicated program-controlled
                  pool. Cancellation before the start returns contributions to
                  the original funders.
                </p>
              </div>
            </div>
            <div className="notice">
              <strong>Draft policy details</strong>
              <p>
                {challenge.mode === "community"
                  ? "One final vote, no self-voting, tie splitting and the community’s 24-hour voting window are proposed defaults. They will be finalized before any real test-token entry."
                  : "Free entry, participant eligibility and the daily visit-count limit are proposed demo defaults. They will be finalized before any real test-token entry. The organizer’s 24-hour decision deadline and equal-split fallback are confirmed rules."}
              </p>
            </div>
          </details>
          <RelatedActivities
            activity={challenge.discipline}
            path={`/challenges/${challenge.id}`}
            venueId={challenge.venueId}
          />
        </div>
        <aside className="detail-aside">
          <section className="rail-card entry-card">
            <span className="eyebrow">EXAMPLE PRIZE POOL</span>
            <div className="prize-number">{formatEurc(challenge.prize)}</div>
            <span className="small-copy">test EURC · not funded onchain</span>
            <div className="entry-divider" />
            <div className="entry-next-step">
              <Pill tone="amber">Preview · Entry not open</Pill>
              <strong>Your next step</strong>
              <p>
                Read the rules and save this challenge. Joining becomes
                available when the Devnet flow is connected.
              </p>
              <ol aria-label="Planned challenge steps">
                <li>Join</li>
                <li>Participate</li>
                <li>
                  {challenge.mode === "community"
                    ? "Vote"
                    : "Organizer decides"}
                </li>
                <li>Claim an allocated payout</li>
              </ol>
            </div>
            <div className="line-item">
              <span>Your entry</span>
              <strong>
                {challenge.entry
                  ? `${formatEurc(challenge.entry)} test EURC`
                  : "Free to join"}
              </strong>
            </div>
            <div className="line-item">
              <span>Organized by</span>
              <strong>{challenge.organizer}</strong>
            </div>
            <div className="spots-track">
              <span
                style={{
                  width: `${(challenge.participants / challenge.capacity) * 100}%`,
                }}
              />
            </div>
            <p className="small-copy">
              {challenge.capacity - challenge.participants} example spots
              available
            </p>
            <button
              className="button lime full"
              onClick={() => setReview(true)}
            >
              Preview entry <ArrowRight size={18} />
            </button>
            <button
              className="button secondary full"
              aria-pressed={saved}
              onClick={() => dispatch({ type: "save", id: challenge.id })}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved to your challenges" : "Save for later"}
            </button>
            <CopyLink path={`/challenges/${challenge.id}`} />
            <Link href="/how-it-works" className="entry-help">
              How challenges work <ArrowRight size={14} />
            </Link>
            <p className="fixture-note centered">
              Preview only. No entry or payment is submitted.
            </p>
          </section>
          <div className="detail-community">
            <AvatarStack />
            <h3>Better with your people.</h3>
            <p>It’s a small group. There’s room for you.</p>
          </div>
        </aside>
      </div>
      {review && (
        <Modal
          title="A little commitment. A shared goal."
          onClose={() => setReview(false)}
        >
          <p className="dialog-copy">{challenge.title}</p>
          <div className="checkout-summary">
            <div className="line-item">
              <span>Entry</span>
              <strong>
                {challenge.entry
                  ? `${formatEurc(challenge.entry)} test EURC`
                  : "Free"}
              </strong>
            </div>
            <div className="line-item">
              <span>Challenge type</span>
              <strong>
                {challenge.mode === "community"
                  ? "Participant-funded"
                  : "Company-sponsored"}
              </strong>
            </div>
          </div>
          <div className="notice">
            <strong>Entries open when the Devnet flow is connected.</strong>
            <p>
              This screen is a preview. You haven’t registered or paid. Even a
              free sponsored entry will require your wallet signature.
            </p>
          </div>
          <button
            className="button dark full"
            onClick={() => {
              if (!saved) dispatch({ type: "save", id: challenge.id });
              setReview(false);
            }}
          >
            Save this challenge <Bookmark size={16} />
          </button>
        </Modal>
      )}
    </>
  );
}
export function CreateChallenge() {
  const router = useRouter();
  const { dispatch } = useDemo();
  const [input, setInput] = useState<DraftInput>({
    title: "",
    description: "",
    mode: "community",
    discipline: "Running",
    amount: "2",
    start: "2026-09-22",
    end: "2026-09-29",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof DraftInput>(key: K, value: DraftInput[K]) {
    setInput((old) => ({ ...old, [key]: value }));
    setErrors((old) => {
      if (!old[key]) return old;
      const next = { ...old };
      delete next[key];
      return next;
    });
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const issues = validateDraft(input);
    setErrors(issues);
    if (Object.keys(issues).length) {
      document.getElementById(Object.keys(issues)[0])?.focus();
      return;
    }
    const id = `draft-${crypto.randomUUID()}`;
    dispatch({
      type: "draft",
      draft: {
        ...input,
        title: input.title.trim(),
        description: input.description.trim(),
        id,
        createdAt: new Date().toISOString(),
      },
    });
    router.push(`/challenges/${id}`);
  }
  const error = (key: string) =>
    errors[key] && (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    );
  return (
    <>
      <Link href="/challenges" className="back-link">
        <ArrowLeft size={16} />
        All challenges
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">EVERY GOOD THING STARTS SOMEWHERE</span>
          <h1>
            Bring your people together<span className="lime-text">.</span>
          </h1>
          <p>Start with an idea. We’ll make it a challenge.</p>
        </div>
        <Pill tone="amber">Local draft</Pill>
      </div>
      <form className="creation-layout" onSubmit={submit} noValidate>
        <div className="form-card">
          <fieldset>
            <legend>
              <span>01</span> How are we doing this?
            </legend>
            <div className="mode-options">
              {(["community", "sponsored"] as const).map((mode) => (
                <label
                  className={`mode-option ${input.mode === mode ? "selected" : ""}`}
                  key={mode}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={mode}
                    checked={input.mode === mode}
                    onChange={() => set("mode", mode)}
                  />
                  {mode === "community" ? (
                    <Users size={24} />
                  ) : (
                    <Zap size={24} />
                  )}
                  <strong>
                    {mode === "community"
                      ? "Community challenge"
                      : "Sponsored challenge"}
                  </strong>
                  <span>
                    {mode === "community"
                      ? "Everyone chips in. Everyone has a vote."
                      : "One creator funds it and picks a winner."}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>02</span> Give it a little personality.
            </legend>
            <div className="field">
              <label htmlFor="title">Challenge name</label>
              <input
                id="title"
                value={input.title}
                maxLength={80}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. The 5K before coffee"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {error("title")}
            </div>
            <div className="field">
              <label htmlFor="discipline">Movement</label>
              <select
                id="discipline"
                value={input.discipline}
                onChange={(e) =>
                  set("discipline", e.target.value as DraftInput["discipline"])
                }
              >
                {["Running", "Strength", "Muay Thai", "Yoga"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="description">What’s the challenge?</label>
              <textarea
                id="description"
                rows={4}
                value={input.description}
                maxLength={1200}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Tell your people what to do, how to take part and what makes this worth showing up for."
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {error("description")}
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span>03</span> Make a plan.
            </legend>
            <div className="form-columns">
              <div className="field">
                <label htmlFor="start">Starts</label>
                <input
                  type="date"
                  id="start"
                  value={input.start}
                  onChange={(e) => set("start", e.target.value)}
                  aria-invalid={!!errors.start}
                  aria-describedby={errors.start ? "start-error" : undefined}
                />
                {error("start")}
              </div>
              <div className="field">
                <label htmlFor="end">Ends</label>
                <input
                  type="date"
                  id="end"
                  value={input.end}
                  onChange={(e) => set("end", e.target.value)}
                  aria-invalid={!!errors.end}
                  aria-describedby={errors.end ? "end-error" : undefined}
                />
                {error("end")}
              </div>
            </div>
            <div className="field">
              <label htmlFor="amount">
                {input.mode === "community"
                  ? "Contribution per person"
                  : "Your sponsored prize"}
              </label>
              <div className="amount-input">
                <span>€</span>
                <input
                  id="amount"
                  inputMode="decimal"
                  value={input.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
                <span>test EURC</span>
              </div>
              {error("amount")}
            </div>
            <p className="small-copy">
              Draft dates and amounts are for planning. Publication will recheck
              dates, eligibility and the final rules.
            </p>
          </fieldset>
          <button type="submit" className="button dark full">
            Save challenge draft <ArrowRight size={18} />
          </button>
        </div>
        <aside className="creation-aside">
          <div className="draft-preview">
            <span className="eyebrow">YOUR CHALLENGE, TAKING SHAPE</span>
            <span className="preview-spark">✳</span>
            <Pill tone="white">{input.discipline}</Pill>
            <h2>{input.title || "Something good starts here."}</h2>
            <p>{input.description || "A few good people. One shared goal."}</p>
            <div className="preview-price">
              <strong>
                {Number.isFinite(Number(input.amount))
                  ? formatEurc(Number(input.amount))
                  : "€—"}
              </strong>
              <span>
                test EURC / {input.mode === "community" ? "person" : "prize"}
              </span>
            </div>
          </div>
          <div className="notice">
            <strong>A draft is just the beginning.</strong>
            <p>
              It stays in this browser. Saving won’t create a live challenge,
              invite people or move money. Company sponsorship will use a
              separate business wallet.
            </p>
          </div>
          <div className="form-checklist">
            <span>
              <Check size={15} />
              Both challenge types supported
            </span>
            <span>
              <Check size={15} />
              Clear cancellation and fallback rules
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
export function DraftDetail({ id }: { id: string }) {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const draft = state.drafts.find((d) => d.id === id);
  if (!draft)
    return (
      <Empty
        title="This draft isn’t here."
        description="Drafts belong to the browser where they were created. Start a new idea or return to your challenges."
        href="/challenges/new"
        action="Create a challenge"
      />
    );
  return (
    <>
      <Link href="/challenges" className="back-link">
        <ArrowLeft size={16} />
        All challenges
      </Link>
      <div className="draft-detail">
        <span className="success-mark">
          <Check size={26} />
        </span>
        <Pill tone="amber">Saved locally · Not published</Pill>
        <h1>{draft.title}</h1>
        <p className="detail-description">{draft.description}</p>
        <div className="detail-metadata">
          <span>
            <Flag />
            <strong>{draft.discipline}</strong>
            <small>{draft.mode}</small>
          </span>
          <span>
            <Coins />
            <strong>{formatEurc(Number(draft.amount))}</strong>
            <small>
              test EURC {draft.mode === "community" ? "per person" : "prize"}
            </small>
          </span>
          <span>
            <CalendarDays />
            <strong>{draft.start}</strong>
            <small>until {draft.end}</small>
          </span>
        </div>
        <div className="notice">
          <strong>Your idea is saved. Your funds haven’t moved.</strong>
          <p>
            Publishing and funding will be available after the real wallet and
            challenge program are integrated. This draft is visible only in this
            browser.
          </p>
        </div>
        <div className="button-row">
          <Link href="/challenges" className="button dark">
            Explore challenges <ArrowRight size={17} />
          </Link>
          <button className="button secondary" onClick={() => setConfirm(true)}>
            <Trash2 size={16} />
            Delete draft
          </button>
        </div>
      </div>
      {confirm && (
        <Modal title="Delete this draft?" onClose={() => setConfirm(false)}>
          <p className="dialog-copy">
            This removes “{draft.title}” from this browser. No funds or
            published challenges are affected.
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Keep draft
            </button>
            <button
              className="button dark"
              onClick={() => {
                dispatch({ type: "delete-draft", id });
                router.push("/challenges");
              }}
            >
              Delete draft
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
