import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, Repeat2 } from "lucide-react";

const accessKinds = [
  {
    title: "Memberships",
    description: "No active or transferable membership yet.",
    Icon: Repeat2,
  },
  {
    title: "Passes",
    description: "No class or visit pass yet.",
    Icon: CreditCard,
  },
  {
    title: "Event tickets",
    description: "No event ticket yet.",
    Icon: CalendarDays,
  },
];

export function MyAccess({ preview }: { preview: boolean }) {
  return (
    <section className="my-access" aria-labelledby="my-access-title">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR ACCESS</span>
          <h1 id="my-access-title">
            Your memberships, passes and tickets will live here
            <span className="lime-text">.</span>
          </h1>
          <p>
            See what is active, what can be used next and which eligible
            memberships can be transferred.
          </p>
        </div>
      </div>
      <div className="access-empty-card">
        <span className="eyebrow">
          {preview ? "PREVIEW STATE" : "EMPTY STATE"}
        </span>
        <h2>No active access yet.</h2>
        <p>
          {preview
            ? "This frontend preview does not create or assign paid access. Exploring a class or event will not add anything here."
            : "This account does not have a membership, pass or event ticket yet. Browsing alone never creates paid access."}
        </p>
        <div className="access-kind-grid">
          {accessKinds.map(({ title, description, Icon }) => (
            <div className="access-kind" key={title}>
              <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <div className="access-actions">
          <Link href="/explore" className="button dark">
            Explore activities <ArrowRight size={17} />
          </Link>
          <Link href="/how-it-works" className="button secondary">
            How access works
          </Link>
        </div>
      </div>
    </section>
  );
}
