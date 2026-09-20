"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Link2 } from "lucide-react";
import type { DiscoveryItem } from "@/domain/discovery";

export function CopyLink({ path }: { path: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [url, setUrl] = useState("");
  const id = useId();
  async function copy() {
    const link = new URL(path, window.location.origin).href;
    setUrl(link);
    setStatus("idle");
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }
  return (
    <div className="copy-link-control">
      <button type="button" className="button secondary full" onClick={copy}>
        {status === "copied" ? <Check size={16} /> : <Link2 size={16} />}
        {status === "copied" ? "Link copied" : "Copy link"}
      </button>
      <span className="sr-only" role="status">
        {status === "copied"
          ? "Public link copied to clipboard."
          : status === "manual"
            ? "Could not copy automatically. Select and copy the link below."
            : ""}
      </span>
      {status === "manual" && (
        <div className="copy-link-fallback">
          <label htmlFor={id}>Select and copy this public link</label>
          <input
            id={id}
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}

export function RelatedActivities({
  items,
  venueRelated = false,
}: {
  items: readonly DiscoveryItem[];
  venueRelated?: boolean;
}) {
  if (!items.length) return null;
  return (
    <section className="detail-section related-activities">
      <h2>{venueRelated ? "More at this studio" : "Keep moving together"}</h2>
      <p className="small-copy">Related activities in our demo catalogue.</p>
      {items.map((item) => (
        <Link className="discovery-result" href={item.href} key={item.href}>
          <span>
            <small>
              {item.kind} · {item.activity}
            </small>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      ))}
    </section>
  );
}
