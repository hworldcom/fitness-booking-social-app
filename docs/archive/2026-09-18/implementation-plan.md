# Implementation plan

> **Historical document — superseded on 18 September 2026.**
> Use the [current MVP specification](../../mvp-spec.md) for all product requirements, milestones, and acceptance criteria.
> This archived text preserves earlier proposals and may contradict the current specification. It is not an implementation instruction.
> Original location: `docs/implementation-plan.md`.

Date: 18 September 2026. No application code exists yet.

Use the [build specification](../../mvp-spec.md) as the implementation contract. Milestones are ordered by dependency and risk, not presented as calendar estimates. Team size and the actual submission deadline have not been confirmed in this task.

## M0 — Foundation and the first membership booking

**Outcome:** A user opens a friend's plan and books the anchor session with a seeded membership. The result survives a restart.

- Bootstrap one Next.js/TypeScript application, Tailwind, PostgreSQL, and Drizzle migrations.
- Add isolated demo runs, server-issued sessions, seeded users, three venues, sessions, entitlements, and cross-gym trainer affiliations.
- Build the persistent mock provider with row-locked inventory, stable operation IDs, and atomic booking/cancellation.
- Implement the pure access resolver and frozen quote/policy records.
- Add session detail, a minimal plan page, membership booking, and a receipt.
- Include request deduplication, ownership checks, transition history, and activity-event uniqueness immediately.

**Exit evidence:** A refresh preserves Anna's booking; duplicate requests produce one seat; concurrent requests for one remaining spot produce one winner; another user cannot cancel or read her private receipt.

## M1 — Prove the actual devnet payment and return transfer

**Outcome:** A small wallet → gym → wallet test verifies the asset and signing approach before wider UI work.

- Check current Solana SDK APIs, choose compatible versions, and pin them.
- Verify devnet RPC identity, Circle mint, token program, and decimals using read-only checks.
- Connect through Wallet Standard and verify a fresh wallet-binding challenge.
- Prepare and simulate an exact test payment with an opaque reference; store attempt details before prompting.
- Have the wallet owner approve the transaction. Record actual signatures and verify transfers server-side.
- Prepare a return transfer in the restricted operator view; the gym wallet owner signs it.
- Confirm that the original user wallet receives the correct asset and amount. Test funds and network fees are visibly labelled.

**Exit evidence:** Two real devnet transactions, independent verification, and no application-held private keys. Verify faucet/funding availability here. Do not advance under a fictional EURC label if only a different token or mock payment is available.

## M2 — Connect payment to booking and recovery

**Outcome:** Daniel books a seat with devnet EURC and can cancel with a verified refund.

- Add holds to the mock provider as an explicit capability.
- Persist payment/refund intents, transaction attempts, references, signatures, and work items.
- Join hold → payment finalization → provider confirmation using idempotent operations.
- Add a bounded reconciliation command/worker for pending payments, provider outcomes, expired holds, and event delivery. Use the same handlers from retries and the worker.
- Recover payments when the client disappears before reporting the signature.
- Add cancellation policy enforcement and operator-signed refunds; keep a cancelled booking visible while a refund is pending.
- Keep the payment simulator available for automated integration tests, isolated from devnet mode.

**Exit evidence:** A finalized payment confirms a valid hold; a late payment after expiry creates a refund obligation; an unknown RPC/provider response cannot cause a duplicate charge or refund.

## M3 — Complete the social loop and external route

**Outcome:** Anna, Max, and Daniel coordinate around the same session, with accurate access evidence.

- Build the social home with a small session list and a feed derived from structured events.
- Complete create plan, invitation link, join/leave, and optional meeting note.
- Add trainer profile, follow/unfollow, and schedule across two gyms.
- Implement the external handoff simulator using the shared provider inventory and explicit booking confirmation.
- Label simulated membership/external evidence, and separate RSVP from confirmed seats.
- Apply invite/participant visibility on the server. Keep receipts and payment metadata private.

**Exit evidence:** The full invitation → mixed-access booking flow works. A handoff click alone confirms nothing. Cancellation updates current plan badges and availability without duplicating feed activity.

## M4 — Demo delivery

**Outcome:** A repeatable, inspectable mobile demo and a clear explanation of what is real.

- Polish the four main screens at phone and desktop widths, keyboard interactions, loading states, and pending/error states.
- Add a persistent “Demo · Solana devnet” indicator and accurate payment/provider labels.
- Provide a restricted fresh-run/reset action. Preserve unresolved financial history and show remaining test-wallet funds separately.
- Complete README setup, environment examples containing no secrets, database/seed/reconcile commands, architecture diagram, and demo instructions.
- Run the acceptance matrix below and rehearse with prefunded wallets.
- Prepare a short recorded fallback for network delays; label it as a recording and use genuine transaction evidence.

Deployment can follow once a hosting destination and database are configured. A published demo must preserve the same actor/run isolation and operator authorization as local execution.

## Acceptance matrix

Use unit tests for resolver/policy decisions, database integration tests for concurrency/idempotency, and browser tests for the user loop. RPC fixtures exercise adverse conditions deterministically. A manual signed devnet rehearsal separately proves the real adapter.

| Scenario | Required result |
| --- | --- |
| Direct membership | One confirmed booking; no payment intent or wallet prompt. |
| Declared USC access | No automatic coverage claim, seat, or EURC charge. |
| External simulated completion | One labelled simulated booking sharing the same provider capacity. |
| Last seat, two requests | At most one hold/booking; loser is not asked to pay. |
| Same idempotency key, changed payload | Reject the mismatch; do not reuse an unrelated result. |
| Double click / retry | Same operation and result, no additional seat or transfer prompt. |
| Rejected wallet signature | No payment; hold can be released safely; retry is explicit. |
| Wrong cluster/mint/amount/recipient/payer/reference | Reject as payment proof; do not confirm booking. |
| Reused payment signature | Cannot satisfy a second intent or another user's booking. |
| RPC timeout after send | Remain pending and reconcile; do not create a second transfer. |
| Browser closes after send | Recover the transfer from its persisted reference/attempt. |
| Hold expires before payment is observed | Release seat; if payment later succeeds, open one refund. |
| Provider create/confirm response lost | Query by operation ID before retrying or refunding. |
| Paid and provider definitively rejects | No confirmed booking; visible outstanding refund. |
| Cancel twice / cancellation response lost | One capacity release and at most one refund obligation. |
| Refund signature rejected / insufficient gym funds | Booking remains cancelled; refund remains pending. |
| Refund submitted but RPC unavailable | Observe the original refund; no second payout. |
| Cancel at/after session start | Apply the frozen server policy consistently. |
| Unauthorized user/run/operator request | Denied; no private data or mutation. |
| Reset with pending payment/refund | Old obligation remains recoverable; new run cannot reuse its signatures. |
| DST/date rollover | Session ordering and cancellation deadlines follow stored instants and venue timezone. |

## Demo script

Aim for a two-to-three-minute live walkthrough; chain confirmation and wallet approvals should not be represented as guaranteed to fit into 90 seconds. A 90-second edit can summarize actual completed steps if the submission format needs it.

1. **Discover:** Open a friend's plan for the anchor session. Point out the trainer's second venue.
2. **Coordinate:** Join the plan. Show that “Going” does not yet mean a seat is booked.
3. **Membership:** Switch to Anna and book with the seeded membership. No wallet prompt.
4. **External:** Switch to Max. Show the unverified route, then complete the clearly labelled provider simulation.
5. **PAYG:** Switch to Daniel, review the test-token checkout, and approve a real devnet transfer. Keep the receipt pending until verified.
6. **Together:** Show the three differently labelled booking routes on the shared plan.
7. **Cancel/refund:** Cancel Daniel's booking; show the released seat and refund pending. Approve the return transfer from the operator's gym wallet, then show its verified receipt.

If confirmation is slow, explain the pending state and use a prior genuine receipt for illustration. Do not replace a pending transfer with a fabricated success.

## Stretch and follow-up boundaries

After all required acceptance criteria pass, the strongest optional feature is one trainer seminar whose payment includes separate gym and trainer transfers in one transaction. It introduces multiple refund recipients/authorities, so define the return-payment policy and tests before enabling it. It does not automatically require a custom program.

Keep production integrations, automated refund custody/escrow, embedded onboarding, and fiat conversion in a later pilot plan. Public documentation or an existing bsport integration with another marketplace does not establish our API access.

Confirm the hackathon's actual deadline, rules, and submission requirements before allocating remaining effort. Those details from the older conversation were not reverified in this review.
