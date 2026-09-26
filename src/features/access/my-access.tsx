import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";

export function MyAccess({ preview }: { preview: boolean }) {
  return (
    <section className="my-access" aria-labelledby="my-access-title">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR ACCESS</span>
          <h1 id="my-access-title">
            Your MovX membership will live here
            <span className="lime-text">.</span>
          </h1>
          <p>
            This area will show your plan, selected gyms and included usage
            after membership activation is implemented.
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
            ? "This frontend preview does not create or assign a paid membership. Browsing gyms will not add anything here."
            : "This account does not have an active MovX membership. Browsing gyms alone never creates paid access."}
        </p>
        <div className="access-kind-grid">
          <div className="access-kind">
            <Dumbbell size={22} strokeWidth={1.5} aria-hidden="true" />
            <h3>Multi-gym membership</h3>
            <p>No active membership has been assigned.</p>
          </div>
        </div>
        <div className="access-actions">
          <Link href="/explore" className="button dark">
            Explore gyms <ArrowRight size={17} />
          </Link>
          <Link href="/how-it-works" className="button secondary">
            How access works
          </Link>
        </div>
      </div>
    </section>
  );
}
