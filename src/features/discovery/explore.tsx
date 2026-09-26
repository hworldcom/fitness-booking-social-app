"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Building2, MapPin, X } from "lucide-react";
import type { ClubStudio } from "@/domain/catalogue";
import type { ActivityFilter } from "@/domain/discovery";
import { ActivityControl } from "@/components/discovery-filters";
import { Artwork, Empty, Modal, Pill } from "@/components/ui";
import { filterStudios } from "@/features/discovery/filters";
import { studios } from "@/features/preview/catalogue";

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
            <Building2 size={12} aria-hidden="true" />
            Gym
          </Pill>
        </span>
      </button>
      <div className="studio-content">
        <span className="studio-location">
          <MapPin size={13} aria-hidden="true" />
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
          View gym <ArrowUpRight size={17} aria-hidden="true" />
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
  return (
    <Modal title={studio.name} onClose={onClose}>
      <p className="studio-dialog-location">
        <MapPin size={15} aria-hidden="true" />
        {studio.area}, Berlin <span>· Illustrative gym</span>
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
        <strong>Example coach{studio.coaches.length === 1 ? "" : "es"}</strong>
        <span>{studio.coaches.join(", ")}</span>
      </div>
      <div className="notice">
        <strong>The membership catalogue is being rebuilt.</strong>
        <p>
          This interim profile does not show live availability, schedules,
          pricing or a partnership with a real venue.
        </p>
      </div>
    </Modal>
  );
}

export function Explore({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [activity, setActivity] = useState<ActivityFilter>("all");
  const [studio, setStudio] = useState<ClubStudio | null>(null);
  const results = filterStudios(studios, { activity, query });
  const filtered = activity !== "all" || !!query.trim();

  function reset() {
    setActivity("all");
    setQuery("");
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MULTI-GYM MEMBERSHIP · PREVIEW</span>
          <h1>
            Explore participating gyms<span className="lime-text">.</span>
          </h1>
          <p>
            Browse a small illustrative gym list while the focused MovX
            membership experience is being rebuilt.
          </p>
        </div>
        <Pill>
          <MapPin size={14} aria-hidden="true" />
          Berlin
        </Pill>
      </div>

      {!!query.trim() && (
        <div className="explore-search-context">
          <span>
            Results for <strong>“{query.trim()}”</strong>
          </span>
          <button
            className="text-link"
            aria-label="Clear search"
            onClick={reset}
          >
            Clear search <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="discovery-filters studios-filters">
        <ActivityControl
          id="studio-activity"
          value={activity}
          onChange={setActivity}
        />
        {filtered && (
          <button className="text-link reset-filters" onClick={reset}>
            Reset filters <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="results-label" aria-live="polite">
        <strong>
          {results.length} {results.length === 1 ? "gym" : "gyms"} in this
          interim preview
        </strong>
        <span>Illustrative profiles · No live availability</span>
      </div>

      <div className="studio-grid">
        {results.map((item) => (
          <StudioCard
            key={item.id}
            studio={item}
            onOpen={() => setStudio(item)}
          />
        ))}
      </div>

      {!results.length && (
        <div className="discovery-empty">
          <Empty
            title="No gyms match those filters yet."
            description="Reset the interim catalogue to see every illustrative gym."
          />
          <button className="button secondary" onClick={reset}>
            Show all gyms <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <p className="catalogue-note">
        This is a temporary frontend catalogue. It does not represent live
        availability, membership activation or confirmed gym partnerships.
      </p>

      {studio && (
        <StudioDetails studio={studio} onClose={() => setStudio(null)} />
      )}
    </>
  );
}
