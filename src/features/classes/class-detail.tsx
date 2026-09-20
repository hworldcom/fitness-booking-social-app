"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock3,
  CalendarDays,
  Check,
  Users,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import type { ClubClass } from "@/domain/catalogue";
import { formatEurc } from "@/components/format";
import { useDemo } from "@/features/preview/store";
import { Artwork, Avatar, Modal, Pill } from "@/components/ui";

export function ClassDetail({ session }: { session: ClubClass }) {
  const { state, dispatch } = useDemo();
  const [dialog, setDialog] = useState<"book" | "pay" | "cancel" | null>(null);
  const [share, setShare] = useState(true);
  const booking = state.bookings.find((b) => b.classId === session.id);
  return (
    <>
      <Link href="/explore" className="back-link">
        <ArrowLeft size={16} />
        Explore sessions
      </Link>
      <div className="detail-layout">
        <div>
          <div className="detail-art">
            <Artwork kind={session.artwork} large />
            <span className="art-pill">
              <Pill tone="white">{session.discipline} · All levels</Pill>
            </span>
          </div>
          <div className="detail-title">
            <span className="eyebrow">
              {session.gym.toUpperCase()} / BERLIN
            </span>
            <h1>{session.title}</h1>
            <p>
              <MapPin size={15} />
              {session.area}, Berlin · Demonstration venue
            </p>
          </div>
          <p className="detail-description">{session.description}</p>
          <div className="detail-metadata">
            <span>
              <CalendarDays size={20} />
              <strong>{session.date}, 2026</strong>
              <small>{session.day}</small>
            </span>
            <span>
              <Clock3 size={20} />
              <strong>{session.time}</strong>
              <small>{session.duration} minutes · Berlin time</small>
            </span>
            <span>
              <Users size={20} />
              <strong>All levels</strong>
              <small>{session.spots} demo spots available</small>
            </span>
          </div>
          <section className="detail-section">
            <h2>Your coach</h2>
            <div className="coach-card">
              <Avatar
                initials={session.trainer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
                color="peach"
              />
              <div>
                <h3>{session.trainer}</h3>
                <p>Supportive coaching. Good technique. A welcoming room.</p>
              </div>
            </div>
          </section>
          <section className="detail-section">
            <h2>Before you show up</h2>
            <p>
              Bring comfortable training clothes, water and a towel. Arrive ten
              minutes early to settle in and meet the group.
            </p>
            <div className="rule-item">
              <ShieldCheck size={20} />
              <div>
                <strong>Attendance means being there.</strong>
                <p>
                  Booking doesn’t add a visit to your profile. Gym staff must
                  confirm attendance in the implemented check-in flow.
                </p>
              </div>
            </div>
          </section>
        </div>
        <aside className="detail-aside">
          <section className="rail-card entry-card">
            <span className="eyebrow">YOUR NEXT SESSION</span>
            <h2>
              {session.membership
                ? "You’re part of the club."
                : "Make some time for you."}
            </h2>
            {session.membership ? (
              <div className="membership-cover">
                <Check size={19} />
                <div>
                  <strong>Covered by your membership</strong>
                  <small>Anna’s seeded Kru Tiger membership</small>
                </div>
              </div>
            ) : (
              <div className="class-detail-price">
                <strong>{formatEurc(session.price)}</strong>
                <span>test EURC / one class</span>
              </div>
            )}
            <div className="line-item">
              <span>Session</span>
              <strong>
                {session.date} · {session.time}
              </strong>
            </div>
            <div className="line-item">
              <span>Venue</span>
              <strong>{session.gym}</strong>
            </div>
            {booking ? (
              <>
                <div
                  className={`notice ${booking.status === "booked" ? "success" : ""}`}
                  role="status"
                >
                  <strong>
                    {booking.status === "booked"
                      ? "Demo booking confirmed"
                      : "Demo booking cancelled"}
                  </strong>
                  <p>
                    {booking.status === "booked"
                      ? "Saved in this browser. No real reservation or confirmed visit."
                      : "The existing activity reflects the cancellation. No money moved."}
                  </p>
                </div>
                {booking.status === "booked" && (
                  <button
                    className="button secondary full"
                    onClick={() => setDialog("cancel")}
                  >
                    Cancel demo booking
                  </button>
                )}
                {booking.shared && !booking.hidden && (
                  <button
                    className="text-link full"
                    onClick={() =>
                      dispatch({ type: "hide", classId: session.id })
                    }
                  >
                    <EyeOff size={15} />
                    Hide activity from the demo feed
                  </button>
                )}
                <Link href="/" className="button dark full">
                  Back to your club <ArrowRight size={17} />
                </Link>
              </>
            ) : (
              <>
                <label className="share-control">
                  <input
                    type="checkbox"
                    checked={share}
                    onChange={(e) => setShare(e.target.checked)}
                  />
                  <span>
                    Share this class in my public activity
                    <small>Preview sharing in this browser’s feed.</small>
                  </span>
                </label>
                <button
                  className="button lime full"
                  onClick={() => setDialog(session.membership ? "book" : "pay")}
                >
                  {session.membership
                    ? "Try a demo booking"
                    : "Preview checkout"}
                  <ArrowRight size={17} />
                </button>
                <p className="fixture-note centered">
                  {session.membership
                    ? "Local simulation · No payment needed"
                    : "No payment or reservation will be submitted"}
                </p>
              </>
            )}
            {!session.membership && (
              <div className="policy-note">
                <strong>Before paying</strong>
                <p>
                  Purchases within 24 hours of class and no-shows are
                  non-refundable. The broader cancellation cutoff and
                  gym-cancellation exceptions are proposed rules, pending
                  confirmation.
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
      {dialog && (
        <Modal
          title={
            dialog === "book"
              ? "Make room for a good session."
              : dialog === "cancel"
                ? "Change of plans?"
                : "A little time for yourself."
          }
          onClose={() => setDialog(null)}
        >
          <p className="dialog-copy">
            {session.title}
            <br />
            <span>
              {session.gym} · {session.date} · {session.time}
            </span>
          </p>
          {dialog === "book" ? (
            <>
              <div className="checkout-summary">
                <div className="line-item">
                  <span>Your membership</span>
                  <strong>Included · No payment</strong>
                </div>
                <div className="line-item">
                  <span>Feed activity</span>
                  <strong>{share ? "Shared demo activity" : "Private"}</strong>
                </div>
              </div>
              <div className="notice">
                <strong>This is a local simulation.</strong>
                <p>
                  It creates a demo booking in this browser. No real gym spot is
                  reserved, no wallet is used and no visit is recorded.
                </p>
              </div>
              <button
                className="button lime full"
                onClick={() => {
                  dispatch({
                    type: "book",
                    classId: session.id,
                    shared: share,
                    now: new Date().toISOString(),
                  });
                  setDialog(null);
                }}
              >
                Confirm demo booking <Check size={18} />
              </button>
            </>
          ) : dialog === "cancel" ? (
            <>
              <p className="dialog-copy">
                Cancel this local membership booking? Its existing feed activity
                will show the cancellation.
              </p>
              <div className="button-row">
                <button
                  className="button secondary"
                  onClick={() => setDialog(null)}
                >
                  Keep booking
                </button>
                <button
                  className="button dark"
                  onClick={() => {
                    dispatch({ type: "cancel", classId: session.id });
                    setDialog(null);
                  }}
                >
                  Cancel demo booking
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="checkout-summary">
                <div className="line-item">
                  <span>One class pass</span>
                  <strong>{formatEurc(session.price)} test EURC</strong>
                </div>
                <div className="line-item">
                  <span>Recipient</span>
                  <strong>{session.gym} business wallet</strong>
                </div>
                <div className="line-item">
                  <span>Network costs</span>
                  <strong>Test SOL · quoted before signing</strong>
                </div>
              </div>
              <div className="notice">
                <strong>Checkout isn’t connected yet.</strong>
                <p>
                  No payment, pass or feed activity is created. The real flow
                  will ask for your Phantom signature and verify the transfer
                  before confirming the booking.
                </p>
              </div>
              <button
                className="button dark full"
                onClick={() => setDialog(null)}
              >
                Back to the session <ArrowRight size={17} />
              </button>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
