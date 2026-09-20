import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { searchCatalogue } from "@/lib/discovery";

export const metadata = { title: "Search" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const results = searchCatalogue(query);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">FIND YOUR NEXT PLAN</span>
          <h1>
            Find your people<span className="lime-text">.</span>
          </h1>
          <p>Classes, studios, events and challenges, all in one place.</p>
        </div>
      </div>
      <form
        action="/search"
        className="catalogue-search"
        role="search"
        aria-label="Catalogue search"
      >
        <Search size={19} aria-hidden="true" />
        <input
          aria-label="Search the public catalogue"
          name="q"
          defaultValue={query}
          key={query}
          maxLength={200}
          placeholder="Try running, coffee or a studio…"
        />
        <button className="button dark" type="submit">
          Search
        </button>
      </form>
      <p className="small-copy">
        Public demonstration catalogue · No account or wallet needed to browse.
      </p>
      {query ? (
        <>
          <div className="results-label">
            <strong>
              {results.length} {results.length === 1 ? "result" : "results"} for
              “{query}”
            </strong>
            <Link href="/search" className="text-link">
              Clear search
            </Link>
          </div>
          {(["Class", "Studio", "Event", "Challenge"] as const).map((kind) => {
            const group = results.filter((item) => item.kind === kind);
            if (!group.length) return null;
            return (
              <section className="search-group" key={kind}>
                <h2>{kind === "Class" ? "Classes" : `${kind}s`}</h2>
                {group.map((item) => (
                  <Link
                    href={item.href}
                    key={item.href}
                    className="discovery-result"
                  >
                    <span>
                      <small>
                        {item.activity} · Demo {kind.toLowerCase()}
                      </small>
                      <strong>{item.title}</strong>
                      <span>{item.detail}</span>
                    </span>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                ))}
              </section>
            );
          })}
          {!results.length && (
            <div className="empty">
              <h2>No matches this time.</h2>
              <p>
                Try an activity, organizer or studio name, or browse the
                catalogue below.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="search-suggestions">
          <h2>A little inspiration</h2>
          <div className="chips">
            {["Running", "Coffee", "Fabrik", "Yoga"].map((term) => (
              <Link
                className="chip"
                href={`/search?q=${encodeURIComponent(term)}`}
                key={term}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="discovery-links">
        <Link className="button secondary" href="/explore">
          Explore activities
        </Link>
        <Link className="button secondary" href="/challenges">
          Browse challenges
        </Link>
      </div>
    </>
  );
}
