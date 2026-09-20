# Fitness Social + Gym Marketplace — Hackathon MVP Summary

> **Historical document — superseded on 18 September 2026.**
> Use the [current MVP specification](../../mvp-spec.md) for all product requirements, milestones, and acceptance criteria.
> This archived text preserves earlier proposals and may contradict the current specification. It is not an implementation instruction.
> Original location: `fitness_social_hackathon_mvp_summary.md`.

**Project goal:** Build a focused, demo-ready MVP for the Solana hackathon that proves the core product thesis without attempting to build the full long-term platform.

**Product thesis:** A social fitness network where users discover who and where to train, keep using whatever gym membership or external entitlement they already have, and pay directly for uncovered sessions from a portable euro-denominated balance.

---

## 1. MVP objective

The MVP should prove one complete loop:

> **See where a friend or trainer is training → join them → resolve access → book → pay in EURC only if needed → reflect the booking socially.**

The hackathon demo should make three things obvious:

1. **Fitness discovery is social**, not just a search marketplace.
2. **Different access methods can coexist** for the same class.
3. **Solana/EURC solves the uncovered pay-per-class path** without forcing crypto-native UX.

The goal is not to build the entire marketplace, aggregator stack, or gym SaaS product. The goal is to prove that the core interaction is useful, coherent, and technically credible.

---

## 2. Core demo story

Use one real-looking class as the anchor, for example:

**Muay Thai at Kru Tiger, 18:00 tonight**

Three users join the same session:

- **Anna** has a direct Kru Tiger membership → **Included**
- **Max** has an external entitlement such as Urban Sports Club → **Covered externally**
- **Daniel** has no applicable entitlement → **€12 pay-per-class via EURC**

All three end up in the same social training plan even though their economic routes differ.

For the pay-per-class user:

1. Open the session.
2. Access Resolver determines there is no existing coverage.
3. User sees **€12**.
4. User confirms booking.
5. EURC transfer occurs on Solana.
6. Booking is confirmed through the provider abstraction.
7. Receipt shows confirmed booking and payment.
8. Cancellation triggers a refund path.

This single flow demonstrates the social network, access aggregation, booking abstraction, and blockchain payment rationale.

---

## 3. MVP user-facing surfaces

Keep the product to approximately seven major screens.

### 3.1 Home / Social Feed

Show structured activity such as:

- Friend booked a class
- Trainer added a session
- Friend created a training plan
- Friend joined a class
- Trainer is teaching at another gym

Primary actions:

- `Join`
- `View class`
- `Book`
- `View trainer`

The feed should be generated from structured events rather than relying on users writing social posts.

### 3.2 Explore

Basic marketplace discovery for:

- Gyms
- Trainers
- Sessions

Optional filters:

- Discipline
- Date/time
- Location
- Price
- Friends attending

Do not build complex recommendation infrastructure for the hackathon.

### 3.3 Session Detail

Show:

- Gym / venue
- Trainer
- Date and time
- Availability
- Friends attending
- Access status
- Network price
- Booking CTA

### 3.4 Access Resolver UI

This is one of the most important product surfaces.

Example states:

```text
Your access

✓ Kru Tiger membership
  Included

OR

✓ Urban Sports Club
  Covered externally

OR

€12
Pay directly
```

The Access Resolver evaluates routes but does not itself create bookings.

### 3.5 Training Plan

A lightweight social coordination object around a real session.

Include:

- Creator
- Session
- Invitees
- Interested
- Going
- Booked
- Invite friend
- Optional note such as “meet 15 min before”

Do not build group chat for the first MVP.

### 3.6 Trainer Profile

Show:

- Trainer bio
- Followers
- Gym affiliations
- Upcoming sessions
- Cross-gym guest sessions / seminars

Trainer identity should be independent from any single gym.

### 3.7 Booking / Receipt

Show:

- Booking status
- Access route
- Amount paid
- Payment status
- Solana transaction reference
- Cancellation
- Refund status

---

## 4. What not to build for the hackathon

Explicitly exclude:

- Full Urban Sports Club integration
- Full Wellhub integration
- Multiple real booking-provider integrations
- Complete bsport integration
- Production fiat → EURC on-ramp
- Production KYC
- Group chat
- Direct messaging
- Gym CRM
- Gym scheduling system
- Dynamic pricing engine
- Corporate wellness
- Network+ subscription
- Recommendation ML
- Dedicated search infrastructure
- Native iOS and Android apps
- On-chain social graph
- Proprietary fitness token
- Microservices
- Complex escrow smart contracts unless time remains

These can remain visible in the roadmap, but they should not block the hackathon demo.

---

## 5. Recommended technical architecture

Use a **mobile-first responsive web app / PWA** with a modular monolith.

```text
Next.js / TypeScript client
        |
        v
Application Backend
(modular monolith)
        |
        +-- Identity / Profiles
        +-- Social Graph
        +-- Catalog
        +-- Training Plans
        +-- Access Resolver
        +-- Booking Orchestrator
        +-- Payment Orchestrator
        +-- Provider Adapters
        |
        v
Postgres
        |
        +----------------------+----------------------+
        |                      |                      |
Mock Booking Provider     Solana Devnet          Wallet layer
                         EURC / SPL
```

### Suggested stack

- **Frontend:** Next.js + TypeScript
- **UI:** Tailwind + shadcn/ui or similar
- **Database:** Postgres
- **ORM:** Drizzle or Prisma
- **Auth:** Simple email/social login
- **Solana:** Solana TypeScript SDK / `@solana/kit`
- **Payments:** Test EURC on Solana Devnet where practical
- **Hosting:** Vercel + managed Postgres
- **Repository:** Single monorepo

The important architectural decision is not the exact framework. It is preserving clean domain boundaries while avoiding premature distributed systems.

---

## 6. Domain model to lock early

Recommended core entities:

```text
User
Trainer
Gym
Venue
Session
TrainerAffiliation

Entitlement
TrainingPlan

Booking
BookingTransition

PaymentIntent
PaymentTransition

ActivityEvent

ExternalRef
ProviderLink
```

### Important modeling rule

A **Trainer is not a child of a Gym**.

A trainer may be:

- Head coach at Gym A
- Guest coach at Gym B
- Seminar host at Gym C

This creates an important cross-gym social and acquisition loop.

---

## 7. Provider abstraction

Build against an interface immediately, even if the implementation is mocked.

Example:

```ts
interface BookingProvider {
  listSessions(...)
  getAvailability(...)
  createBooking(...)
  cancelBooking(...)
  getBooking(...)
}
```

Initial implementation:

```text
MockBookingProvider
```

Future implementations:

```text
BsportProvider
MindbodyProvider
EversportsProvider
```

Do not block the hackathon on private provider documentation or production API access.

---

## 8. Access Resolver

The Access Resolver should calculate possible booking routes without performing side effects.

Example:

```ts
resolveAccess(user, session) => [
  {
    type: "DIRECT_MEMBERSHIP",
    cost: 0,
    status: "VERIFIED"
  },
  {
    type: "EXTERNAL_ENTITLEMENT",
    provider: "USC",
    cost: 0,
    status: "DECLARED"
  },
  {
    type: "NETWORK_PAYG",
    asset: "EURC",
    cost: 12,
    status: "AVAILABLE"
  }
]
```

Recommended ranking:

1. Verified direct membership
2. Verified external entitlement
3. Existing class-pack credit
4. Network pay-per-class
5. Other user-selected routes

The UI may allow a user to choose a different route when useful.

---

## 9. Booking state machine

Keep booking and payment as separate but correlated state machines.

Suggested booking path:

```text
INITIATED
  ↓
ACCESS_RESOLVED
  ↓
PAYMENT_AUTHORIZED?   (only if required)
  ↓
PROVIDER_BOOKING_REQUESTED
  ↓
PROVIDER_BOOKING_CONFIRMED
  ↓
CONFIRMED
  ↓
ATTENDED | CANCELLED | NO_SHOW
  ↓
SETTLED | REFUNDED | PARTIAL_SETTLEMENT
```

Core engineering properties:

- Idempotency
- Persisted transitions
- Recoverable failure states
- Reconciliation
- Provider remains authoritative for inventory

For the hackathon, a simplified implementation is acceptable as long as the state model is visible in the code.

---

## 10. Simplified Solana / EURC payment path

Do not overbuild smart-contract logic initially.

For the hackathon:

```text
BOOK
 |
 v
Access Resolver
 |
 +-- Covered ----------> Provider booking
 |
 +-- Pay €12 ----------> EURC transfer
                              |
                              v
                        Provider booking
                              |
                 +------------+-------------+
                 |                          |
              success                    failure
                 |                          |
            CONFIRMED                 refund / revert
```

Persist the blockchain transaction reference in `PaymentIntent`.

On cancellation:

```text
CANCELLED
   ↓
EURC refund
   ↓
REFUNDED
```

Later, the payment layer can evolve toward delegated authorization, escrow, allowances, or payment channels without changing the product-level abstraction.

---

## 11. Seed data for the demo

Use three gyms.

### Gym 1 — Kru Tiger

The real design anchor.

Include:

- Realistic trainers
- Realistic weekly classes
- Direct memberships
- Pay-per-class sessions

### Gym 2 — Fightzone

Use a simulated provider.

Include at least one trainer who also teaches at Kru Tiger.

This demonstrates trainer portability.

### Gym 3 — Yoga / Functional Fitness Studio

Use another simulated provider.

This demonstrates that the product is not specific to combat sports or one gym category.

---

## 12. Social event model

Feed activity should come from structured events.

Examples:

```text
BOOKED
ATTENDED
CREATED_PLAN
JOINED_PLAN
TRAINER_ADDED_SESSION
FOLLOWED_TRAINER
```

Each event can include:

```text
actor
verb
object
visibility
sourceEventId
occurredAt
metadata
```

Benefits:

- Easier privacy controls
- Deterministic feed generation
- Easy deep links into bookings
- Less UI work than building social posting tools

---

## 13. Optional stretch feature

Only after the main loop is stable:

### Trainer seminar with revenue split

Example:

```text
€30 seminar booking

€24 → gym
€6  → trainer
```

This is a strong blockchain-native demonstration because it shows programmable settlement between independent participants rather than merely “paying with crypto.”

Do not attempt this until the standard booking flow works end-to-end.

---

## 14. 90-second demo flow

Design the MVP around this golden path.

### 0:00–0:15 — Social discovery

Open the feed:

> “Anna and Alex are training Muay Thai at 18:00.”

### 0:15–0:30 — Session detail

Open the class.

Show:

- Trainer
- Kru Tiger
- Friends attending
- Remaining capacity

### 0:30–0:45 — Existing membership

Anna joins.

App shows:

> Kru Tiger membership — Included

Book.

### 0:45–1:05 — Pay-per-class

Switch to Daniel.

Same class:

> No existing access  
> €12 — Pay directly

Book using EURC.

### 1:05–1:15 — Social state

Training plan now shows everyone booked together.

### 1:15–1:30 — Cancellation / refund

Cancel Daniel’s booking.

Show:

> €12 refunded

The user sees a simple euro-denominated flow while the blockchain transaction remains available as technical proof.

---

## 15. Implementation order

Build in this order.

### M0 — Vertical slice

Goal:

> Three people can join the same class through three different access routes.

Implement:

```text
DB schema
  ↓
Seed users / trainers / gyms / sessions
  ↓
MockBookingProvider
  ↓
AccessResolver
  ↓
Booking state machine
  ↓
Session detail UI
```

### M1 — Social layer

Add:

- Profiles
- Follow graph
- Trainer affiliations
- Activity feed
- Training plans

### M2 — Payments

Add:

- Wallet abstraction
- EURC test payment
- PaymentIntent
- Transaction tracking
- Fee sponsorship if practical

### M3 — Cancellation and reliability

Add:

- Cancel booking
- Refund
- Idempotency
- Basic reconciliation
- Useful error states

### M4 — Demo polish

Add:

- Demo seed data
- Responsive UI
- Smooth loading states
- Explorer transaction links
- Architecture diagram
- README
- Demo script

---

## 16. Success criteria

The MVP is ready when:

- A new viewer understands the product within 10–15 seconds.
- The social feed is visible immediately.
- A user can open a real-looking session.
- Different users receive different access routes.
- Existing membership booking costs €0.
- External entitlement can be demonstrated through a mock or handoff.
- Pay-per-class executes a real or credible EURC transaction.
- Booking state is persisted.
- Cancellation/refund works.
- A trainer can appear at more than one gym.
- The same session can be shared socially among users with different access methods.
- The demo works repeatedly without manual database fixes.

---

## 17. Product positioning for the hackathon

Avoid positioning the product as:

> “ClassPass on Solana.”

A stronger framing is:

> **One app to find who and where to train. Use whatever access you already have — or pay directly when you do not.**

The long-term product is not just a booking marketplace.

It combines:

```text
People
   ×
Trainers
   ×
Gyms
   ×
Entitlements
   ×
Payments
```

For the hackathon, however, only one complete loop needs to work convincingly.

---

## 18. Final scope rule

Whenever a new feature is proposed, ask:

> **Does this materially improve the core demo: social discovery → join → access resolution → booking → payment if needed?**

If the answer is no, defer it.

The strongest hackathon submission will not be the one with the largest feature list. It will be the one where the core product thesis is immediately understandable, the UX feels coherent, and the technical implementation proves the difficult part of the idea.

---

## Source basis

This MVP summary was distilled from the project’s:

- **Hybrid Product Brief**
- **Engineering Architecture Brief**
- **Business Strategy Brief**

Working drafts dated **18 September 2026**.
