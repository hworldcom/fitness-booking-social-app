# MVP review

> **Historical document — superseded on 18 September 2026.**
> Use the [current MVP specification](../../mvp-spec.md) for all product requirements, milestones, and acceptance criteria.
> This archived text preserves earlier proposals and may contradict the current specification. It is not an implementation instruction.
> Original location: `docs/mvp-review.md`.

Reviewed: 18 September 2026.

**Verdict:** The product thesis supports a focused hackathon MVP. The brief is strong on positioning and exclusions, but its access and payment flows need more precise contracts before implementation.

## Review basis

Reviewed the complete local [MVP summary](fitness_social_hackathon_mvp_summary.md) and the available messages in the referenced **Solana Hackathon Project Fit** conversation. The conversation reader returned no attachments, so the separately generated hybrid, engineering, and business briefs were not individually reviewed.

The user confirmed a hackathon demo with simulated gym integrations and real devnet payments. This review does not assume production API access, signed gym partnerships, real memberships, or a funded production payment service.

## What to preserve

- **The social entry point:** A friend or trainer gives someone a concrete reason to book.
- **Mixed access:** People should be able to train together while using different access methods.
- **Trainer portability:** A trainer's profile and following should span venues.
- **Provider-owned inventory:** Booking adapters own availability and reservations; the feed does not.
- **A narrow on-chain boundary:** Payment records belong on Solana; social relationships and class details stay in the application.
- **The exclusions:** No fiat ramps, real aggregator integration, custom token, gym operating system, or escrow program in the baseline.

## Findings and recommended changes

### 1. External membership does not establish session eligibility or booking authority

**Source:** Summary sections 2, 3.4, 8, and 16.

The resolver example marks USC as `DECLARED`, yet the UI says “Covered externally” and the demo can imply everyone has a confirmed seat. A declared subscription does not tell us that this venue/session is eligible, that limits remain, or that we can book on the user's behalf.

**Change:** Model eligibility, evidence, and booking capability separately. Max can join a training plan and continue through a clearly labelled external booking simulator. Only the simulator's explicit confirmation can create a simulated external booking. A click on the handoff link or an “I'm going” RSVP is insufficient.

**Acceptance:** Merely declaring USC access never gives Max an included booking, removes a seat, or produces a verified booking badge.

### 2. Payment-before-booking creates avoidable refund obligations

**Source:** Summary sections 2 and 10.

The proposed flow transfers funds before reserving inventory, then offers “refund / revert” if booking fails. Solana's atomicity applies to instructions inside a transaction; a subsequent provider HTTP request is outside that boundary. A completed payment needs a new compensating transfer to return funds. [Solana transaction documentation](https://solana.com/docs/core/transactions).

**Change:** For our mock provider, hold a seat first, then collect payment, then finalize the booking. Treat holds as a capability we implement in the simulator, not a capability promised by bsport. Handle a late successful payment after hold expiry by creating a refund obligation.

**Acceptance:** A full class cannot initiate payment; a paid but unbookable request is recoverable and visible as requiring a refund.

### 3. Refund ownership and authority are unspecified

**Source:** Summary sections 9, 10, and 14.

If money goes directly to the gym wallet, the backend cannot automatically return it without that wallet's signing authority. “Cancel → refunded” hides the most important operational dependency.

**Change:** Use a demo gym wallet controlled by the presenter. Cancellation releases the seat through the provider and records a refund request. A restricted operator view prepares a refund for that wallet to sign. The server independently verifies the return transfer before showing “Refunded.” No server-held private key is needed.

**Tradeoff:** Refunds work end to end but require an operator. This demonstrates settlement; it does not prove automated, trustless refunds. An escrow program is a separate future product decision.

### 4. The proposed booking state machine still mixes booking and money

**Source:** Summary section 9.

Despite recommending separate state machines, the booking path contains payment authorization and ends in settlement/refund states. This makes a cancelled booking with an outstanding refund difficult to represent.

**Change:** Separate `Booking`, `PaymentIntent`, and `Refund` lifecycles. Derive plan booking badges from booking evidence. Attendance is another fact and must not be inferred from a payment or reservation.

**Acceptance:** The receipt can accurately display “Booking cancelled / Refund awaiting gym approval.”

### 5. Reliability is scheduled too late

**Source:** Summary section 15, especially M3.

Adding idempotency after real payments leaves duplicate-click, refresh, retry, and timeout behavior undefined while money is already moving.

**Change:** Add request keys, unique constraints, persistent transitions, and concurrent inventory checks with the first booking slice. Add signature verification and reconciliation with the first payment slice.

**Acceptance:** Retrying a request cannot create another seat, charge, refund, or social event. Unknown transaction status remains pending until reconciled.

### 6. The test-token requirement should be definite

**Source:** Summary sections 5 and 16.

“EURC / SPL,” “where practical,” and “real or credible EURC transaction” permit incompatible definitions of completion. A fabricated signature or a different SPL mint is not proof of EURC settlement.

Circle currently lists EURC on Solana devnet and explicitly says test tokens have no financial value. Its published Solana mint address is identical across the listed mainnet and devnet entries, making the cluster part of asset identity. [Circle EURC addresses](https://developers.circle.com/stablecoins/eurc-contract-addresses).

**Change:** Target Circle's devnet EURC, verify the configured mint and cluster at startup, and label test funds throughout checkout and receipts. If funding is unavailable, a disclosed test SPL token can support development but does not satisfy the EURC release criterion.

### 7. Seven screens and broad identity work dilute the first build

**Source:** Summary sections 3, 5, and 6.

The access resolver is a component of session checkout. Explore can begin as a list on the home page. Full account onboarding and trainer management are not necessary to prove the loop.

**Change:** Build four main screens, a compact trainer profile, seeded demo identities, and a small restricted operator view. Keep following a trainer and creating/joining a plan functional. Defer account provisioning, profile editing, and advanced discovery.

### 8. Social intent, privacy, and stale activity need explicit rules

**Source:** Summary sections 3.5 and 12.

The brief lists “Interested,” “Going,” and “Booked” without defining which can change inventory. It mentions event visibility without deciding who can see future training locations or private payment information.

**Change:** An RSVP consumes no seat. Booking status is derived from provider evidence. Plans are invite-only by default. Share minimal session/participation information with allowed viewers; hide access route, wallet, payment amount, and receipt from other participants. Cancellation must remove the current booking badge without erasing its audit history.

## Business assessment

The first customer hypothesis should be **a gym member inviting friends who have different memberships**, with cross-gym trainer followers as a related discovery path. This uses the social value even when no paid transaction happens. A small, connected cohort is a better initial experiment than a broad catalogue with few social connections.

The demo can prove workflow coherence and payment execution. It cannot establish demand, lower total payment costs, aggregator displacement, or the sustainability of 0% commission.

Keep the economic proposal explicit: the gym sets the class price, the demo takes no platform commission, and network/account costs remain separate. Future bank conversion costs, support/refund costs, and potential SaaS revenue require validation. Historical USC/ClassPass payout examples in the conversation are not underwriting assumptions for this build.

Suggested next research after the demo:

1. Observe a small group of prospective users creating a plan and inviting a friend; record where they hesitate.
2. Ask two prospective gym partners about available seats, pricing control, cancellations, and integration access.
3. Measure invitation → plan join → booking attempt → confirmed booking by route.
4. Revisit wallet onboarding and monetization with evidence from those sessions.

## Scope decision

Proceed with a **social booking demo**, three demo venues, three access routes, one persistent mock provider, and one real devnet payment adapter. Keep the trainer split as stretch scope after payment, cancellation, and recovery work reliably.

The detailed recommendations are in the [build specification](../../mvp-spec.md) and [implementation plan](implementation-plan.md).
