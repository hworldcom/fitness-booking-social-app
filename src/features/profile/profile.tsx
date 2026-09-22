"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Flag,
  Footprints,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { useActor } from "@/auth/client/actor-provider";
import { profileInitials } from "@/auth/profile-presentation";
import { signInHref } from "@/auth/return-to";
import {
  Avatar,
  ChallengeCard,
  Empty,
  Modal,
  Pill,
  SectionTitle,
} from "@/components/ui";
import { challenges, people } from "@/features/preview/catalogue";
import { useDemo } from "@/features/preview/store";

type DemoPerson = (typeof people)[number];

export function Profile({ personId }: { personId?: string }) {
  const person = people.find((candidate) => candidate.id === personId);

  if (personId && !person) {
    return (
      <Empty
        title="We haven’t met this member yet."
        description="This profile isn’t part of the demo community."
        href="/profile"
        action="Back to your profile"
      />
    );
  }
  if (person) return <PublicDemoProfile person={person} />;
  return <OwnerProfile />;
}

function PublicDemoProfile({ person }: { person: DemoPerson }) {
  const { state, dispatch } = useDemo();

  return (
    <>
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to the club
      </Link>
      <section className="profile-cover">
        <span className="profile-cover-word">GOOD COMPANY.</span>
      </section>
      <div className="profile-heading">
        <Avatar initials={person.initials} color={person.color} />
        <div>
          <h1>{person.name}</h1>
          <p>{person.bio} · Berlin</p>
          <Pill>Demo community member</Pill>
        </div>
        <button
          className="button dark"
          onClick={() => dispatch({ type: "follow", id: person.id })}
        >
          {state.following.includes(person.id) ? <Check size={16} /> : null}
          {state.following.includes(person.id) ? "Following" : "Follow"}
        </button>
      </div>
      <section className="profile-public-note">
        <Footprints size={24} />
        <h2>Movement is better with company.</h2>
        <p>
          Follow {person.name.split(" ")[0]} to see their demo class joins and
          challenges in your Following feed.
        </p>
      </section>
      <SectionTitle title="Something to try together" href="/challenges" />
      <div className="challenge-grid">
        {challenges.slice(0, 2).map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            saved={state.saved.includes(challenge.id)}
            onToggleSaved={() => dispatch({ type: "save", id: challenge.id })}
          />
        ))}
      </div>
    </>
  );
}

function OwnerProfile() {
  const { actor } = useActor();

  if (actor.status === "unavailable") {
    return <ProfileAccessUnavailable />;
  }

  if (actor.status !== "authorized") {
    const preview = actor.status === "preview";
    const profileRequired = actor.status === "forbidden";
    return (
      <section className="protected-access-state">
        <span className="eyebrow">YOUR PROFILE</span>
        <h1>
          {preview
            ? "Create an account to make this space yours."
            : profileRequired
              ? "Finish setting up your profile."
              : "Sign in to see your profile."}
        </h1>
        <p>
          {preview
            ? "This frontend preview does not assign you a demo person. After email sign-in, your profile uses the display name you chose."
            : profileRequired
              ? "Your verified email session has no completed MovX Club profile yet. Choose a display name to continue."
              : "MovX Club shows personal identity only after the server verifies the signed-in account."}
        </p>
        <div className="protected-access-actions">
          <Link
            href={
              preview
                ? "/sign-in"
                : profileRequired
                  ? "/sign-in?returnTo=%2Fprofile&reason=forbidden"
                  : signInHref("/profile")
            }
            className="button dark"
          >
            {profileRequired ? "Complete profile" : "Go to sign-in"}
          </Link>
          <Link href="/explore" className="button secondary">
            Continue public browsing
          </Link>
          {preview && <ResetPreviewButton />}
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR ACCOUNT PROFILE</span>
          <h1>
            Your corner of the club<span className="lime-text">.</span>
          </h1>
        </div>
        <ResetPreviewButton extraClassName="reset-button" />
      </div>
      <section className="profile-cover">
        <span className="profile-cover-word">KEEP SHOWING UP.</span>
        <span className="cover-spark">✳</span>
      </section>
      <div className="profile-heading">
        <Avatar initials={profileInitials(actor.profile.displayName)} />
        <div>
          <h2>{actor.profile.displayName}</h2>
          <p>
            <UserRound size={14} />
            Email-backed MovX Club profile
          </p>
          <Pill>Account profile</Pill>
        </div>
        <Link href="/challenges/new" className="button dark">
          <Flag size={16} />
          Start a challenge
        </Link>
      </div>
      <section className="profile-public-note account-profile-note">
        <BadgeCheck size={24} />
        <h2>Your profile is connected to this account.</h2>
        <p>
          This page currently shows only the display name you chose. Personal
          activity appears here only when its owning app features store real
          data for this account.
        </p>
      </section>
      <div className="account-profile-empty">
        <Empty
          title="Your account starts with a clean slate."
          description="No visits, passes, balances, sessions, follows or activity history are being claimed for this profile."
          href="/explore"
          action="Find something to do"
        />
      </div>
    </>
  );
}

function ProfileAccessUnavailable() {
  return (
    <section className="protected-access-state" role="alert">
      <span className="eyebrow">PROFILE UNAVAILABLE</span>
      <h1>We couldn’t verify your profile right now.</h1>
      <p>
        Your session or the local database may be unavailable. No personal
        identity or history was shown.
      </p>
      <div className="protected-access-actions">
        <Link href="/sign-in" className="button dark">
          Check sign-in
        </Link>
        <Link href="/explore" className="button secondary">
          Continue public browsing
        </Link>
      </div>
    </section>
  );
}

function ResetPreviewButton({
  extraClassName = "",
}: {
  extraClassName?: string;
}) {
  const { dispatch } = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`button secondary ${extraClassName}`.trim()}
        onClick={() => setOpen(true)}
      >
        <RotateCcw size={15} />
        Reset browser preview
      </button>
      {open && (
        <Modal title="Start with a clean slate?" onClose={() => setOpen(false)}>
          <p className="dialog-copy">
            This clears browser-only drafts, saved challenges and follows. It
            does not change your account, funds or blockchain records.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="button secondary"
              onClick={() => setOpen(false)}
            >
              Keep my preview
            </button>
            <button
              type="button"
              className="button dark"
              onClick={() => {
                dispatch({ type: "reset" });
                setOpen(false);
              }}
            >
              Reset browser preview
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
