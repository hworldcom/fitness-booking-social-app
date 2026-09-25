# Coordination COR0007: Core multi-gym membership MVP

- Status: In progress
- Created: 2026-09-25
- Last updated: 2026-09-25
- Milestone: M0–M4 core multi-gym membership delivery
- Converted from: Not applicable — created as a coordination record
- Tracked development tickets: completed [DEV0069 — Adopt core multi-gym membership MVP](../../archive/organisatory/DEV0069-adopt-core-multigym-membership-mvp.md), completed [DEV0070 — Revise multi-gym plan pricing](../../archive/organisatory/DEV0070-revise-multigym-plan-pricing.md), [DEV0023 — Minimal shared activity feed](../backend/DEV0023-minimal-shared-activity-feed.md), and required peer tickets identified below
- Related records: catalogue dependency [COR0006](COR0006-persistent-access-catalogue.md); existing identity/wallet work [COR0003](COR0003-account-first-identity-and-wallet-linking.md); hosted staging [DEV0055](../backend/DEV0055-hosted-supabase-staging-environment.md) and [DEV0056](../backend/DEV0056-staging-release-and-domain-rehearsal.md); superseded contract history [DEV0058](../../archive/organisatory/DEV0058-fitness-access-mvp-contract.md), [DEV0066](../../archive/organisatory/DEV0066-freeze-membership-product-rules.md) and [DEV0068](../../archive/organisatory/DEV0068-revise-subscription-and-pass-resale-contract.md)

## Objective and boundaries

Coordinate the smallest coherent MovX Club product: a member chooses four participating gyms, activates Basic or Classic for one period, uses verified included check-ins, and can buy an eligible member-priced visit at another participating gym. Gyms see scoped operational evidence and a transparent provisional usage allocation. Members may follow one another and explicitly share verified check-ins.

Membership transfers, transfer fees, standalone passes/resale, ordinary or sponsored events, challenges and reactions are not part of this coordination outcome. Final gym payouts, production billing/renewal, refund law, taxes and commercial partner onboarding also remain outside the hackathon implementation until their economics are confirmed.

This record coordinates peer development work; it does not authorize implementation by itself. Each runtime or documentation change belongs to the direct DEV ticket listed below. COR0006 supplies the participating-gym and plan catalogue as a dependency rather than a nested workstream.

## Direct development work

| Implementation part | Development ticket | Owned deliverable | Start condition or dependency |
| --- | --- | --- | --- |
| Current product contract | Completed [DEV0069 — Adopt core multi-gym membership MVP](../../archive/organisatory/DEV0069-adopt-core-multigym-membership-mvp.md) | Authoritative specification, navigation/status copy and reconciled delivery records | Delivered; documentation only |
| Plan pricing and allowance amendment | Completed [DEV0070 — Revise multi-gym plan pricing](../../archive/organisatory/DEV0070-revise-multigym-plan-pricing.md) | Change Basic to €80/ten included check-ins and Classic to €150/unlimited while preserving the daily limit | Delivered after DEV0069; documentation only |
| Public positioning and legacy UI removal | Required frontend peer ticket not yet created | Rewrite Home/How it works and remove transfer, pass, event, sponsorship, challenge and reaction concepts from current routes | After DEV0069; may use COR0006 public plan read model when available |
| Membership setup and member access | Required frontend peer ticket not yet created | Plan comparison, exactly-four gym selection, activation review and member period/usage states | After catalogue read model and membership application contracts are stable |
| Membership period, selection and activation | Required blockchain-primary peer ticket not yet created | Versioned period/program state, frozen four-gym selection, idempotent Devnet-EURC activation and server reconciliation | After COR0006 plan schema and applicable wallet authority work |
| Reservation, included check-in and provisional allocation | Required backend peer ticket not yet created | Capacity-aware reservation, authorized/idempotent Basic/Classic usage and transparent provisional allocation read models | After membership period contract; replaces the removed class-pass plan in cancelled DEV0018 |
| Non-core member-priced visit | Required blockchain-primary peer ticket not yet created | Eligible direct Devnet-EURC gym payment, verification/reconciliation and separate attendance evidence | After active-period and gym-wallet contracts |
| Gym operations and allocation interface | Required frontend-primary peer ticket not yet created | Scoped staff confirmation, attendance history and clearly provisional allocation presentation | After check-in/allocation services; DEV0041 gym-wallet authority is a dependency |
| Minimal social loop | [DEV0023 — Minimal shared activity feed](../backend/DEV0023-minimal-shared-activity-feed.md) | One-way follows plus chronological explicitly shared verified membership check-ins | After at least one real membership check-in source exists |

Every required uncreated row needs a fresh DEV ticket linked back to COR0007 before implementation begins. Cross-cutting tickets select one primary area and own their complete vertical boundary rather than duplicating work in multiple records.

## Other relationships

- [COR0006](COR0006-persistent-access-catalogue.md) is a dependency. It owns versioned plan and participating-gym catalogue persistence/services, not membership ownership, payment, usage or settlement.
- COR0003 and its identity/wallet tickets provide verified actors and optional personal-wallet ownership; they do not create a membership.
- DEV0041 provides separate gym-wallet authority; it does not prove an activation, visit or payout.
- DEV0055/DEV0056 provide hosted staging infrastructure and release rehearsal. Deployment remains a separate decision after integrated validation.
- Cancelled DEV0018 preserves the old pass-oriented reservation plan. The new membership check-in peer must use the current plan and daily rules without inheriting pass ownership/resale behavior.
- Archived DEV0058/DEV0066/DEV0068 describe superseded product contracts and are historical baselines only.

## Delivery sequence and completion conditions

DEV0069 freezes the target first. COR0006 can then deliver the participating-gym and versioned-plan read model while the public-positioning ticket removes outdated claims. Membership activation depends on that catalogue plus the applicable account/wallet boundaries. The member setup UI may begin against reviewed contracts but cannot claim working access until real activation/reconciliation exists.

Included check-ins and the gym operational view follow an active membership period. The direct non-core visit may proceed in parallel once active-period eligibility and gym-wallet destinations are stable. DEV0023 begins only after a verified check-in source exists. Final integration joins these paths on hosted staging.

Complete COR0007 only when every direct row has a DEV ticket that is Completed or explicitly Cancelled/replaced, the definition of done and A01–A24 in the specification pass, removed products have no current controls or promises, and the end-to-end Devnet demonstration persists and reconciles across reloads. Provisional allocation must remain visibly distinct from claimable payout.

## Progress and integration record

- 2026-09-25: The product was narrowed to one multi-gym membership after the user removed four-gym contract transfer as unnecessary MVP complexity, retained minimal social and removed passes plus ordinary/sponsored events.
- 2026-09-25: DEV0069 completed the specification and planning-record reconciliation. Runtime work has not started under this coordination record.
- 2026-09-25: DEV0070 raised the working Basic/Classic prices to €80/€150 and raised Basic's included allowance from eight to ten; all remain configurable demo hypotheses.

## Validation results

Work-map, reciprocal-link and status validation is part of DEV0069. Each direct implementation ticket owns its detailed tests and evidence. Final integration must exercise the complete Basic path, Classic daily rule, non-core payment, gym-scoped operations, privacy, retry/recovery and mobile/desktop keyboard flows against persistent staged data.

## Risks, limitations, and follow-ups

The business model is intentionally provisional. Four gyms and the illustrative €80/€150/€8 values need interviews and modelling. Classic high-frequency use may lower effective gym compensation. Pool scope, unused value, refunds, reserves, taxes and final payout remain unresolved and must not be hidden behind a polished allocation UI.

Six runtime/frontend direct tickets have not yet been created. Their absence blocks implementation of those rows but does not block independent catalogue, identity, wallet or public-copy planning.

## Completion and review references

- Completed: Not completed.
- Direct development tickets: DEV0069 Completed; DEV0070 Completed; DEV0023 Draft; six required implementation peers not yet created.
- Commit: Not applicable — coordination-record IDs are not used in commit subjects.
- Review: Coordination self-review in DEV0069; no independent review.
- Deployment or release: None.
