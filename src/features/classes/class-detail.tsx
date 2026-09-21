"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock3,
  CalendarDays,
  Users,
  ShieldCheck,
} from "lucide-react";
import type { ClubClass } from "@/domain/catalogue";
import { formatEurc } from "@/components/format";
import { Artwork, Avatar, Modal, Pill } from "@/components/ui";

export function ClassDetail({ session }: { session: ClubClass }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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
                  Buying a pass doesn’t add a visit to your profile. Venue staff
                  must confirm attendance in the future check-in flow.
                </p>
              </div>
            </div>
          </section>
        </div>
        <aside className="detail-aside">
          <section className="rail-card entry-card">
            <span className="eyebrow">YOUR NEXT SESSION</span>
            <h2>Make some time for you.</h2>
            <div className="class-detail-price">
              <strong>{formatEurc(session.price)}</strong>
              <span>test EURC / one class</span>
            </div>
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
            <button
              className="button lime full"
              onClick={() => setCheckoutOpen(true)}
            >
              Preview checkout <ArrowRight size={17} />
            </button>
            <p className="fixture-note centered">
              No payment or reservation will be submitted
            </p>
            <div className="policy-note">
              <strong>Before paying</strong>
              <p>
                Purchases within 24 hours of class and no-shows are
                non-refundable. The broader cancellation cutoff and
                venue-cancellation exceptions are proposed rules, pending
                confirmation.
              </p>
            </div>
          </section>
        </aside>
      </div>
      {checkoutOpen && (
        <Modal
          title="A little time for yourself."
          onClose={() => setCheckoutOpen(false)}
        >
          <p className="dialog-copy">
            {session.title}
            <br />
            <span>
              {session.gym} · {session.date} · {session.time}
            </span>
          </p>
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
              No payment, pass or feed activity is created. The real flow will
              ask for your wallet signature and verify the transfer before
              confirming access.
            </p>
          </div>
          <button
            className="button dark full"
            onClick={() => setCheckoutOpen(false)}
          >
            Back to the session <ArrowRight size={17} />
          </button>
        </Modal>
      )}
    </>
  );
}
