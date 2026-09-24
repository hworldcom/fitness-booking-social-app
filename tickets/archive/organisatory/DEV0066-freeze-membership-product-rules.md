# Ticket DEV0066: Freeze membership product rules

- Status: Completed
- Created: 2026-09-24
- Last updated: 2026-09-24
- Milestone: M0 frozen product contracts
- Coordination: None — independent development ticket
- Related records: follows [DEV0058 — Adopt the fitness-access MVP contract](DEV0058-fitness-access-mvp-contract.md), [DEV0063 — Redesign the How it works product story](../frontend/DEV0063-redesign-how-it-works-product-story.md), and [DEV0064 — Add transfer-fee and waitlist entry](../frontend/DEV0064-transfer-fee-and-waitlist-entry.md); prepares future membership database, Solana-program and interface tickets

## Objective and context

Turn the confirmed transferable-membership direction into implementable product rules before any new membership schema or Solana program is designed. Define two MVP membership products, unlimited but paid whole-entitlement transfers, deterministic holding/remaining-time gates, cancellation/recovery behavior and staff-confirmed redemption while keeping customer memberships distinct from application participants and organization roles.

This ticket resolves the membership-specific P09–P11 decisions in the [MVP specification](../../../docs/mvp-spec.md#proposed-defaults-to-resolve). It changes the authoritative contract only; it does not add tables, program accounts, payments or interface behavior.

## Scope and non-goals

- In scope: confirm Annual Unlimited and Six-Month Flex 12 product rules; define access allowance semantics; define unlimited completed transfers with one pending invitation, a 10-EURC recipient-paid gym fee, 30-day minimum continuous holding and strictly-more-than-30-day remaining validity; freeze whole-entitlement movement, acceptance, cancellation/recovery and redemption rules; update milestones and implementation order.
- Out of scope: exact consumer purchase prices; recurring billing; database migrations; program account layout; transaction construction; interface implementation; pass refund P01; class-visit P07; sponsored-event P12; production legal terms or real-money operation.

## Expected behavior and edge cases

The issuing business publishes a versioned prepaid product with frozen duration, access model, transferability and fee terms. Annual Unlimited lasts 365 days and records genuine staff-confirmed entries without decrementing an allowance. Six-Month Flex 12 lasts 183 days and begins with twelve entries; every genuine redemption consumes one. Neither auto-renews.

A transferable entitlement may move any number of times, but only sequentially. The current holder must have held it continuously for at least 30 days, and strictly more than 30 days must remain when the recipient accepts. The entire remaining term and, for Flex 12, remaining entry balance move together. A completed transfer never resets expiry or allowance. The recipient pays 10 Devnet EURC directly to the issuer; there is no sender proceeds or MovX transaction surcharge.

Exactly 30 held days is eligible; exactly 30 remaining days is not. A pending invitation cannot coexist with another transfer and cannot bypass acceptance-time eligibility. Failed, cancelled or expired invitations move no entitlement and charge no fee. Unlimited transfer count does not mean immediate circulation because each new holder receives a new `holder_since` timestamp and must satisfy the 30-day holding period.

## Assumptions, decisions, and dependencies

- Use fixed durations for deterministic program logic: 365 days for the public 12-month product and 183 days for the public six-month product. The transfer gates use exact 30 × 24-hour intervals rather than variable calendar months.
- Both product fixtures use one shared configurable membership contract/program; they are not separate smart contracts.
- Transferability is selected by the business per product version. The MVP imposes no completed-transfer count cap on a transferable product.
- Only one transfer may be pending. The invitation lasts 24 hours, the sender may cancel before acceptance, and all eligibility is rechecked at acceptance.
- A successful fee and holder change are atomic. Unknown outcomes are reconciled before retry. Successful transfer fees are non-refundable because the transfer service completed; failed or unfulfilled transfer operations return the fee to its payer.
- No voluntary customer refund or membership freeze exists in the MVP. Customer cancellation may end future access but returns no funds. Paid-but-unfulfilled purchase returns the purchase payment. Issuer cancellation revokes access only through a recorded recovery that returns the original purchase payment to its original payer; completed transfer fees remain settled.
- The user accepted the rules through the 24 September membership-contract discussion, including the final changes to unlimited transfers, 10 EURC, two products and the 30-day holding requirement.

## Implementation plan

1. Promote P09–P11 from proposed membership defaults to adopted rules and update C20, C21 and C26.
2. Replace the suggested generic membership state with product-version and entitlement semantics that distinguish unlimited from visit-limited access.
3. Define purchase, transfer, fee, redemption, cancellation and recovery rules with deterministic boundary examples.
4. Update M0/next-order language so future membership schema, program and interface tickets may be prepared without treating this documentation ticket as runtime authorization.
5. Validate terminology, internal links and consistency with the no-recurring-billing, account/wallet and predictable-cost contracts.

## Acceptance criteria

- [x] AC1: The specification defines Annual Unlimited as 365-day unlimited access and Six-Month Flex 12 as 183-day access with twelve entries, both as versions/configurations of one membership system.
- [x] AC2: A transferable product permits unlimited sequential completed transfers while enforcing one pending invitation, recipient acceptance, 30 days of continuous holding and strictly more than 30 days remaining at acceptance.
- [x] AC3: Each successful transfer atomically moves the whole remainder and 10 Devnet EURC from the recipient to the issuing gym; failed/unfulfilled transfers do not leave a fee or holder change, and MovX receives no transaction surcharge.
- [x] AC4: Redemption distinguishes unlimited entry logging from checked visit decrement, retains immutable history and serializes with transfer; cancellation, no-freeze and recovery behavior are explicit.
- [x] AC5: P09–P11 and the implementation order no longer describe resolved membership rules as open, while P01, P07, P12 and P13 remain explicitly unresolved where applicable.
- [x] AC6: Documentation links and terminology checks pass; no runtime/schema/deployment claim is made.

## Validation plan

Review the specification decision table, programmable-membership section, definition of done and M0/M2 milestones as one contract. Search current documentation for contradictory transfer caps, unresolved 10-EURC fee details, mandatory visit allowances, recurring billing or the removed customer-membership table name. Validate repository-local Markdown links and run `git diff --check`; application/database tests are not applicable because this ticket changes no runtime files.

## Implementation record

Implementation began after the user chose the final product/transfer rules. Record the completed specification changes and evidence below before archiving.

### Changes and rationale

The specification now defines two initial prepaid products through one shared configurable membership system. Annual Unlimited lasts a deterministic 365 days and records unlimited genuine entries without a balance. Six-Month Flex 12 lasts 183 days, begins with twelve entries and decrements exactly once per genuine staff-confirmed redemption. Neither product auto-renews; purchase prices remain exact business-defined catalogue data rather than being invented by this contract ticket.

Transferable product versions permit unlimited sequential completed transfers rather than a platform count cap. Only one 24-hour invitation may be pending, the sender may cancel before acceptance, and the existing-account recipient must explicitly accept with a proved wallet. Acceptance rechecks at least 30 continuous held days and strictly more than 30 remaining days. Each new holder receives a fresh `holder_since`; expiry and any limited allowance never reset.

The recipient pays exactly 10 Devnet EURC to the issuer's club wallet atomically with holder change. The sender receives nothing and MovX charges no transfer surcharge. Failed, cancelled, expired or unfulfilled transfers retain neither fee nor holder change; finalized successful fees remain settled. The contract also freezes no voluntary refund/freeze, purchase and issuer-cancellation recovery, unlimited-versus-limited redemption, immutable reversals and transfer/redemption serialization.

The definition of done, milestones, acceptance matrix and demo script now prove these rules. DEV0017 may persist the frozen product terms but not entitlements; DEV0018 and DEV0023 still require verified membership source tickets and cannot fabricate access or activity.

### Affected files

| File or component | Change and purpose |
| --- | --- |
| `docs/mvp-spec.md` | Promote membership defaults into the current product contract and unblock bounded implementation tickets. |
| `tickets/README.md` | Register this development record and its completion state. |
| Retired `DEV0017` plan (now `tickets/current/organisatory/COR0006-persistent-access-catalogue.md`), `DEV0018-class-pass-reservations-and-confirmed-visits.md`, `DEV0023-minimal-shared-activity-feed.md` | Reconcile downstream plans with the frozen product rules while preserving their separate runtime ownership. |

### Decisions and deviations

- 2026-09-24: Replaced the initial one-transfer/visit-limited suggestion with business-selected transferability, unlimited sequential transfers and two access models after user review.
- 2026-09-24: Used fixed 365-, 183- and 30-day durations for deterministic program enforcement while retaining the public 12-month, six-month and one-month language.
- 2026-09-24: Kept exact purchase prices outside this ticket because the user selected product shapes and transfer price, not consumer purchase amounts; the catalogue must freeze those exact values before paid publication.

### Contracts, configuration, and operations

Documentation contract only. No database relation, program account, API, dependency, environment variable or deployment changed. Future schemas/programs must distinguish `unlimited` from `entry_limited`, store an explicit `holder_since`, preserve exact product-version terms and treat the 10-EURC fee/holder change as one recoverable operation.

## Validation results

Validated on 2026-09-24 as documentation-only work.

- Reviewed the confirmed-decision register, P09–P11 statuses, scope, programmable-membership contract, definition of done, M0/M2 milestones, acceptance matrix and demo script as one contract.
- A focused search found no active `transfers_remaining`, one-completed-transfer cap, unresolved membership fee payer/amount, mandatory entry balance or unresolved P09–P11 language. Remaining `remaining visits` wording is only the generic My Access display, where it applies to Flex 12.
- Updated DEV0017, DEV0018 and DEV0023 to link the frozen rules without moving entitlement/payment/social implementation into those tickets.
- A Node-based repository-local Markdown link check passed for all six changed documents.
- `git diff --check` passed.
- Application, database and browser tests were not run because no runtime/schema/interface file changed.

| Criterion | Evidence | Result |
| --- | --- | --- |
| AC1–AC5 | Cross-section specification and downstream-ticket consistency review | Passed |
| AC6 | Repository-local link audit, terminology search and `git diff --check` | Passed |

## Risks, limitations, and follow-ups

Purchase prices remain business-defined and the two fixture amounts must be selected before paid publication. P12 still blocks sponsored-event funding. Program/schema tickets must define storage, seeds, upgrade authority and exact transaction recovery without changing these product rules silently. Production consumer-law, tax and fiat-price obligations remain outside this Devnet/test-fund contract.

## Completion and review references

- Completed: 2026-09-24 — froze the two product models plus transfer, fee, cancellation/recovery and redemption rules in the authoritative specification.
- Commit: Not created; use `[DEV0066] Freeze membership product rules` when authorized.
- Review: Documentation consistency self-review completed; no independent review.
- Deployment or release: Documentation only; none.
