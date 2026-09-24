# MovX Club — Hackathon MVP specification

Last updated: 24 September 2026.

**Current product direction:** MovX Club connects flexible fitness access with lightweight community. People discover fitness businesses and experiences, purchase memberships, passes and event tickets, participate in person, and may explicitly share verified activity. Fitness businesses publish access products and events, including events whose attendee access is funded or subsidized by a sponsor.

**Implementation status:** the responsive Next.js preview, local database/authentication foundation, protected actor context, email one-time-passcode accounts, optional wallet-linking work, club-wallet authority work and staging foundation exist. The public description, **How it works** guide and Home/Explore/My Access/Profile navigation now present the access-focused direction; retired product-challenge routes, fixtures and local actions are removed. My Access remains an explicit empty preview. The preview has no persistent product catalogue, usable membership, paid access, sponsored-event settlement, confirmed reservation, real EURC payment or deployed membership program.

**Brand:** MovX Club. Public positioning leads with fitness, people and access. Solana, Phantom and EURC are enabling infrastructure, not the opening product explanation. The existing visual identity remains the baseline; DEV0059 delivered the access-first public-guide hierarchy without replacing that identity.

## Authority and maintenance

This is the single source of truth for current product scope, behavior, architecture, milestones and acceptance. [AGENTS.md](../AGENTS.md) owns contributor workflow and [the ticket index](../tickets/README.md) owns delivery status. Archived documents and completed tickets preserve earlier decisions but do not override this specification.

The 24 September 2026 pivot supersedes challenge creation, participant voting, creator-selected winners, prize pools, payout claims and challenge-derived social activity. It also supersedes the earlier exclusion of consumer memberships and the planned Cheer reaction. Archived challenge/no-membership records remain historically accurate and must not be rewritten as though they made the new decision.

Confirmed requirements and proposed defaults remain distinct. Do not turn a proposed transfer, refund, sponsorship or operational rule into public certainty merely because an implementation architecture could support it.

### Navigation

- [Confirmed direction](#confirmed-target-and-decisions), [proposed defaults](#proposed-defaults-to-resolve), [product](#1-product-promise-and-scope), [screens](#2-screens-and-actions).
- [Fixtures and accounts](#3-demo-fixtures-and-account-model), [evidence](#4-participation-and-attendance-evidence), [architecture](#5-architecture-and-storage).
- [Memberships](#6-programmable-membership-contract), [passes and events](#7-class-passes-payments-and-refunds), [wallet integrity](#8-asset-wallet-and-demo-integrity), [social](#9-social-behavior-and-permissions).
- [Definition of done](#10-definition-of-done), [milestones](#11-delivery-milestones), [acceptance](#12-acceptance-matrix), [demo](#13-demo-script), [follow-ups](#14-stretch-and-follow-up-boundaries).

<a id="confirmed-target"></a>

## Confirmed target and decisions

| ID  | Confirmed direction or constraint                | Current contract                                                                                                                                                                                                                                                       |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C01 | Hackathon demo first                             | Responsive web app, simulated gym operations, real Solana Devnet transactions and test funds only. No real money or live partner inventory.                                                                                                                            |
| C07 | Real pass purchase                               | A dated class or visit pass can be purchased with real test EURC. A simulated checkout is not completed payment or access.                                                                                                                                             |
| C08 | Late purchase and no-show                        | A pass bought less than 24 hours before a class is non-refundable for customer cancellation. A no-show is non-refundable. The full policy remains P01.                                                                                                                 |
| C09 | Staff-confirmed participation                    | Payment, entitlement, reservation, social intent and attendance are separate. Authorized venue staff must confirm a visit; the access source can be a valid pass or an explicitly verified membership entitlement.                                                     |
| C10 | No badge/NFT requirement                         | No badge mint, membership NFT or on-chain achievement is required. Program Derived Address (PDA) state is the recommended membership starting point; tokenization is a later interoperability decision.                                                                |
| C11 | Explicit activity sharing                        | A verified booking or attendance fact may become a chronological activity item only through a visible sharing choice. Payment details remain private and sharing grants no access.                                                                                     |
| C12 | Account first, wallet optional until needed      | Register and sign in by email code. A normal Phantom browser wallet is linked later for wallet-backed actions. Club administrators use their individual account and a distinct authorized club wallet; connection is not login or ownership proof.                     |
| C13 | EURC-only MVP                                    | Circle Solana Devnet EURC is the only payment asset for memberships, passes, event tickets, sponsorship funding and eligible returns. Test SOL pays network/account costs.                                                                                             |
| C14 | Separate club and personal funds                 | Financially active fitness businesses use a dedicated club wallet, separate from an administrator's personal wallet. Business receipts and returns use the club wallet.                                                                                                |
| C15 | Honest private balances                          | Available test EURC, submitted/pending payments and refunds awaiting transfer are distinct. Personal and club balances never merge.                                                                                                                                    |
| C16 | Paid events                                      | Individuals and organizations can host a dated experience with a clear ticket price and benefit for every valid ticket holder. Event redemption is single-use and is not a gym visit unless a separate class/visit entitlement says so.                                |
| C17 | Public discovery                                 | Everyone can browse supported public businesses, memberships, passes, classes and events without an account or wallet. Protected actions require verified identity and permissions.                                                                                    |
| C18 | Clear public guidance                            | Search, comparable access information, clean public links, related activities and an easy-to-find How it works guide must describe the current product honestly and work on mobile/desktop without login.                                                              |
| C19 | Minimal social layer                             | One-way follows and chronological Community/Following views may support discovery and explicitly shared participation. There are no reactions, comments, direct messages, general posts, notifications or algorithmic ranking in the MVP. Social data stays off-chain. |
| C20 | Memberships are core                             | Fitness businesses can offer bounded membership products with validity, visit allowance and business-defined transferability. Membership access is distinct from application dataset participation and organization roles.                                             |
| C21 | Transferability is the flagship program behavior | The MVP demonstrates purchase of a membership and transfer of its remaining entitlement when the frozen product rules permit it. Transfer cannot bypass expiry, status, visit or recipient rules.                                                                      |
| C22 | Challenges removed                               | Challenge creation, funding, entry, voting, winner selection, prize pools, claims and challenge progress are outside the current MVP. Wallet-authentication challenges are unrelated security nonces and remain.                                                       |
| C23 | Sponsored events are events                      | A sponsored event is an ordinary event where a sponsor covers some or all attendee access. It has no winner, vote, prize pool or merit judgment.                                                                                                                       |
| C24 | Product family                                   | Memberships provide ongoing access; passes provide bounded class/visit access; events provide dated experiences; sponsorship is a funding variant of an event rather than a separate competition product.                                                              |
| C25 | Predictable business costs                       | MovX uses minimal, predictable platform pricing with no MovX per-transaction surcharge or hidden charge. Unavoidable payment, network and account costs remain distinct and must be shown with the fee payer before approval.                                          |

### Superseded decision history

Earlier C02–C06 made challenge creation and settlement central; earlier C09 excluded memberships; earlier C19 included Cheers. The user replaced those decisions on 24 September 2026. Historical tickets may still cite them, but current implementation must follow C09 and C19–C25 above.

### Proposed defaults to resolve

| ID  | Choice                                | Working default                                                                                                                                                                                                    | Dependency/status                            |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| P01 | Pass refund                           | Full original pass-price refund when cancellation is captured at least 24 hours before class start; no customer refund later or for no-show; full return for business cancellation or paid-but-unfulfilled access. | Resolve before paid pass publication.        |
| P06 | Token coverage                        | Resolved by C13: Devnet EURC only, with the exact configured mint and no token selector or conversion.                                                                                                             | Adopted.                                     |
| P07 | Visit definition                      | At most one confirmed visit per user, venue and venue-local date; staff confirmation allowed during the session through 30 minutes after scheduled end.                                                            | Resolve before visit constraints.            |
| P08 | Account/wallet onboarding             | Resolved by C12: email account first, optional personal wallet proof, separate club-wallet proof and no automatic merge or delegated signing.                                                                      | Adopted.                                     |
| P09 | First membership transfer model       | One free whole-entitlement transfer to another existing MovX account with a linked personal wallet; recipient acceptance required; no negotiated resale or marketplace.                                            | Proposed; freeze before program/schema work. |
| P10 | Partial-use transfer                  | Remaining validity and remaining visits move together; prior redemptions remain immutable. Transfer and redemption serialize so neither can double-use the entitlement.                                            | Proposed.                                    |
| P11 | Membership cancellation/refund/freeze | Business cancellation and paid-but-unfulfilled access require a recoverable return; customer cancellation, freezes and transfer fees are not yet resolved.                                                         | Blocks final membership terms and copy.      |
| P12 | Sponsored-event funding               | Sponsor prepays a fixed test-EURC budget or directly funds the host; supported ticket quantity/discount and unused-fund behavior are frozen before publication.                                                    | Architecture and refund rules unresolved.    |
| P13 | Platform price and network fee payer  | No MovX per-transaction surcharge; choose the minimal recurring/fixed platform price and state who covers each Solana network/account cost. Every amount and payer appears before approval.                         | Resolve before live business pricing.        |

P02–P05 were challenge rules and are retired with C22. Changing a current choice requires updating this specification and its owning development ticket, not creating a competing product document.

### Business differentiation and validation

The hypothesis is that transparent, programmable transferability creates value when a member's circumstances change and helps access move through real relationships. The technical implementation does not prove that gyms will permit transfers or that customers want them. Before production commitments, validate at least:

- whether businesses prefer whole-membership transfer, guest access or transferable session packs;
- when partial use, recipient eligibility, fees, freezes, cancellation and refunds are acceptable;
- whether sponsor-funded event access improves acquisition for hosts and sponsors;
- whether the minimal activity layer helps discovery/retention without becoming a generic social network.
- whether the minimal fixed/recurring platform price is sustainable and materially clearer for businesses than per-transaction pricing.

<a id="visual-design-direction--21-september-2026"></a>

### Visual design direction

Keep the established MovX identity and accessible responsive foundation. Public pages should use concrete product language, strong hierarchy and fewer competing cards/status labels. How it works must establish the proposition and audience benefits before implementation caveats: transferable eligible access and participation-based community for people; minimal predictable platform fees, no MovX transaction surcharge and no hidden charges for businesses. Technology and test-fund details remain visible but secondary, and public copy must not erase unavoidable network/account costs.

<a id="discovery-and-how-it-works"></a>

### Discovery and How it works

DEV0059 delivered the new public narrative in this order: concise proposition; `Discover → Choose access → Show up → Stay connected`; membership/pass/event comparison; sponsored access; value for businesses; honest preview status and short frequently asked questions. DEV0060 removed the remaining challenge-led navigation and product surfaces and added the honest My Access empty state.

<a id="public-browsing-and-sign-in-boundaries"></a>

### Public browsing and sign-in boundaries

Public discovery and product/event details require no account. Saving private items, buying access, accepting a membership transfer, viewing My Access, sharing personal activity, staff redemption and business management require the relevant verified identity and role. Sign-in must return safely to the intended internal destination and recheck eligibility; it never triggers a wallet transaction automatically.

## 1. Product promise and scope

MovX Club is a social fitness-access platform. People discover places and experiences, choose flexible access, participate and connect around real activity. Fitness businesses gain a public channel and infrastructure to offer memberships, passes and events, including sponsor-funded access.

The public story is one loop, not four unrelated products:

```text
Discover -> Access -> Participate -> Connect -> Return
```

### In the MVP

- Public discovery of seeded fitness businesses, classes, membership products and events.
- Email accounts with optional linked personal wallets and separately authorized club wallets.
- One bounded programmable membership product, purchase with test EURC, holder display and permitted transfer.
- Dated class/visit passes with capacity-aware reservation and staff-confirmed attendance.
- Paid event tickets with stated benefit and authorized single-use redemption.
- One sponsored-event example with explicit funding/discount terms and no winner.
- Minimal one-way follows and chronological, opt-in verified activity without reactions.

### Outside the MVP

- Product challenges, competitions, voting, prizes and winner payouts.
- Paid peer-to-peer membership resale or a secondary marketplace.
- Recurring card/bank billing, fiat conversion or production money.
- Universal multi-gym credits, partner inventory integration or automated revenue sharing.
- General social posts, reactions, comments, messages, notifications or feed ranking.
- Membership NFTs, wallet-native collectibles or open marketplace interoperability.

## 2. Screens and actions

| Surface            | MVP purpose and boundary                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home               | Small chronological Community/Following view and relevant public updates. No reactions or ranking. Until shared data exists, fixtures are labelled demonstration content. |
| Explore            | Public businesses, classes, memberships, passes and events with filters/search and comparable access, date, price and status information.                                 |
| My Access          | Authenticated memberships, remaining visits/validity, passes, tickets, transfer state and receipts. Before repositories exist, show an honest empty/preview state.        |
| Profile            | Minimal account identity, following and explicitly shared participation. Private wallet, receipt and detailed access data are not public profile fields.                  |
| How it works       | Public people/business explanation of the access loop, product types, sponsored events, preview status and wallet/test-fund boundary.                                     |
| Business workspace | Authorized administrators manage prepared business context and later product/event drafts, club-wallet actions and refund obligations. No shared business login.          |

Legacy `/challenges` routes, challenge creation and challenge search are retired by DEV0060. Direct legacy URLs should resolve deliberately without redirecting to an unrelated purchase. Product challenge removal must not affect `/api/wallet/**/challenge`, which issues bounded message-signing nonces.

## 3. Demo fixtures and account model

Use at least two ordinary email accounts, one prepared fitness-business organization, one primary administrator, assigned venue staff, distinct personal wallets and a distinct club wallet. Fixtures include one membership product, one class pass, one ordinary event and one sponsored event. Use future-relative schedules plus separate elapsed-time examples; do not fake chain time on Devnet.

The Auth subject, application profile, dataset participation, organization role, connected wallet, durable wallet binding and access entitlement are separate records. Open signup creates only an ordinary profile/dataset participant. It never creates a membership, business role, staff role, wallet authority or paid access.

## 4. Participation and attendance evidence

Keep these states separate:

```text
Payment observed != entitlement valid != reservation confirmed
Reservation confirmed != attendance confirmed != activity shared
```

- A membership grants access only while its frozen rules, holder, validity, remaining visits and status permit the requested use.
- A pass grants only its dated/bounded access after verified payment and reservation confirmation.
- An event ticket grants only the stated event benefit and never increments a gym visit by itself.
- A sponsored ticket differs only in funding/price allocation; it is not evidence of attendance.
- Authorized venue/host staff performs redemption. The attendee cannot self-confirm.
- Duplicate or concurrent redemption cannot consume more than the entitlement allows.
- Sharing is an explicit off-chain visibility choice and cannot create payment, access or attendance.

<a id="5-architecture"></a>

## 5. Architecture and storage

Use one Next.js/TypeScript application with PostgreSQL/Drizzle and one small Anchor/Rust membership program. Keep public discovery, application identity, roles, private receipts and social data off-chain. Put only the minimum state needed for enforceable membership purchase/holder/transfer rules on-chain; server projections and reconciliation make that state usable in the app.

```text
Browser -> Next.js services -> PostgreSQL
   |              |
   |              +-> catalogue, identity, reservations, events, social
   v
Phantom -> Solana Devnet -> membership program / EURC transfers
                         -> verified projections and recovery
```

<a id="database-provider-recommendation--19-september-2026"></a>

### Database provider recommendation — 19 September 2026

Retain Supabase managed PostgreSQL, server-side Next.js services and Drizzle. Use Supabase Auth for email codes; keep business data in an unexposed `app` schema and keep the browser Data API disabled. Hosted provisioning/status remains owned by DEV0055–DEV0056.

### Authentication and data access recommendation

Verify the Supabase session on the server and derive profile, dataset and role context there. Never trust browser-supplied user, run, organization, venue or wallet identifiers as authority. Set actor/run context transaction-locally for protected database work so pooled connections cannot inherit another user. Public catalogue reads use a separate restricted allowlist and server-selected active dataset.

Wallet connection exposes only an address. Durable personal or club authority requires the purpose-bound single-use message proofs from DEV0047/DEV0041. Every financial transaction still requires explicit wallet review/signature; the app stores no private key and performs no unattended signing.

### Database delivery phases

1. **Delivered foundation:** profiles, dataset participation, organizations, roles, venues, class sessions, protected context and wallet bindings.
2. **Public product data:** businesses, membership/pass products, classes, events, sponsor presentation, private drafts, follows/bookmarks.
3. **Access records:** membership projections, reservations, passes, tickets, redemptions, visits, payment attempts, refund obligations and idempotency/outbox work.
4. **Minimal activity:** visibility choices and chronological projections; no reaction table.

Do not reintroduce the removed `membership_entitlements` schema unchanged. The new membership model needs a fresh ticket, explicit on-chain/off-chain authority boundary and forward migration.

### Social data design

Profiles and follows remain same-dataset and authenticated. Activity items derive from verified booking/attendance or authorized public business/event sources and preserve source evidence plus owner visibility. There is no `activity_reactions` table or reaction API in the MVP.

### Migrations, environments and seed boundaries

Use additive forward migrations, reproducible fixtures and separate migration/runtime roles. Local reset may destroy disposable local data; hosted obligations require export/reconciliation and must never be erased to simplify a demo. Seed rows cannot claim real payment, transfer, redemption or sponsorship.

### Next implementation order and decisions

Complete the current identity/staging work without expanding its authority. COR0005's contract/public transition is complete; next freeze P09–P12, prepare bounded membership/program and sponsored-event tickets, and revise DEV0017/DEV0018/DEV0023 against those contracts. Do not implement future runtime scope under the completed COR0005 record.

<a id="security-boundary"></a>

### Security boundary

Validate program/account owner, PDA seeds, signer, mint/token program, holder, issuer, status, time, recipient and amount. Independently verify finalized transfers; a client success callback, balance change or transaction signature alone is insufficient. Persist stable operation IDs before prompting and reconcile unknown outcomes before inviting another payment.

<a id="6-challenge-contract-and-settlement"></a>

## 6. Programmable membership contract

The legacy section-6 challenge contract is superseded by C22. Section 6 now owns the membership lifecycle.

### Product and entitlement separation

A business defines a membership product off-chain with display content and frozen enforceable terms. Purchase creates or assigns program-controlled membership state plus a verified server projection. Suggested minimum state:

```text
Membership {
  id, issuer, product_version, holder,
  valid_from, expires_at, visits_remaining,
  transferable, transfers_remaining, status
}
```

The exact account layout, seeds, storage payer, close authority and upgrade authority belong to the future program ticket. A PDA is application state, not automatically a wallet-visible asset or non-fungible token (NFT).

### Purchase

- Load issuer, product version, price, EURC mint and policy from trusted server/program state.
- Resolve the proved personal payer wallet and distinct club recipient/authority.
- Persist a stable intent before the wallet prompt and simulate the exact Devnet transaction.
- Membership assignment and payment must be atomic or have a defined paid-but-unfulfilled recovery path.
- Display active access only after independent finalized verification and valid projection.

### Transfer

The current recommended demonstration is a whole-entitlement gift transfer, not resale. The current holder initiates, an eligible signed-in recipient accepts with a proved wallet, and the program validates holder, issuer/product, active status, time, remaining allowance and transfer limit. A successful transfer changes the holder once; prior redemptions remain immutable. Transfer and redemption races serialize. Unknown outcomes are reconciled before retry.

Do not claim that a wallet uniquely identifies a person. New-customer, geography, age or account-policy restrictions require verified application data and a reviewed privacy/authority design; they are not proven by a recipient address.

### Validity, redemption and cancellation

Use approximate chain time for program boundaries and an exclusive `now < expires_at` validity rule unless the program ticket adopts another explicit convention. Present local dates using the business timezone. No midnight worker is required to make time-derived expiry effective.

Only authorized venue staff can redeem access. Each redemption records entitlement, venue, staff actor and time; checked subtraction prevents underflow and duplicates. Freeze, customer cancellation, business cancellation, refunds, wallet recovery and account closure remain unresolved under P11 and cannot be improvised in code or public copy.

## 7. Class passes, payments and refunds

### Passes and reservations

A class/visit pass covers one stated access unit or package. Dated classes use capacity holds and atomic reservation confirmation. Active holds plus confirmed reservations never exceed capacity. Payment finality does not manufacture capacity; funds received after expiry create a recoverable obligation.

```text
Reservation: INITIATED -> HELD -> CONFIRMED -> CANCELLED
                         HELD -> EXPIRED / FAILED
Payment: CREATED -> AWAITING_SIGNATURE -> SUBMITTED -> FINALIZED
Access: ISSUED -> REDEEMED / CANCELLED / NO_SHOW
Refund: REQUIRED -> AWAITING_BUSINESS_SIGNATURE -> SUBMITTED -> FINALIZED
```

Unknown chain outcome remains pending. One signature/transfer satisfies one intent. Verify payer, recipient, mint/program, amount, reference and execution independently. The full refund boundary follows confirmed C08 and unresolved P01.

### Events

An event freezes host, time/place, capacity, inclusions, price, policy and authorized redemption context. A finalized payment issues one ticket; retries cannot duplicate payment or ticket. An authorized host redeems it once. Event-specific cancellation/no-show/failed-delivery terms must be resolved before paid publication and do not silently inherit class rules.

### Sponsored events

A sponsored event keeps the same event/ticket/redemption lifecycle. The sponsor covers a disclosed fixed amount or attendee discount; every eligible ticket receives the advertised benefit. No prize, winner or voting exists. Before real sponsorship funding, freeze:

- sponsor and host wallet authorities;
- total funded budget and ticket allocation/discount;
- when the host receives funds;
- unused-budget return recipient/timing;
- cancellation and paid-but-unfulfilled recovery;
- per-account eligibility and retry/idempotency behavior.

The first public preview may label a seeded event sponsored without claiming an on-chain sponsorship transfer. The first real implementation may use a direct verified sponsor-to-host payment if that satisfies the frozen policy; a vault is not mandatory merely for technical novelty.

## 8. Asset, wallet, and demo integrity

Use Circle Solana Devnet EURC only. The configured mint currently documented for the demo is `HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr`; verify cluster, program owner, decimals and supported extensions rather than trusting symbol/mint text alone. Devnet EURC has no financial value. Test SOL pays fees and account storage.

Show euro-oriented amounts with an adjacent test label, for example `€12.00 — test EURC`, plus a persistent `Devnet · Test funds` context. Available, submitted/pending and refund-awaiting amounts are separate. A local fixture, wallet callback or database row cannot establish a finalized payment.

Never request/store seed phrases or private keys. Simulate the exact transaction, show amount/recipient/fee payer/cluster and wait for user approval. Default to Devnet/local testing. Program upgrade authority and trust implications remain visible.

## 9. Social behavior and permissions

The social layer helps people discover and return to real fitness activity; it is not an engagement product.

- One-way follow/unfollow, no approval or automatic reciprocity.
- Chronological Community and Following views with stable pagination.
- Items come from explicitly shared verified participation or authorized public business/event updates.
- No reactions, counts, comments, messages, notifications, free-form posts or ranking.
- Opening an item leads to the public product/event detail; it never grants access or transacts.
- Hiding/removing an item affects its projections and caches without changing payment, entitlement or attendance evidence.
- Same-dataset and source visibility apply to feed/profile reads; guests receive only deliberately public catalogue details.
- Share links contain no private IDs, receipts, wallet addresses or hidden activity.

<a id="source-evidence-sharing-and-privacy"></a>

### Source evidence, sharing and privacy

Persist the visibility choice before asynchronous publication and use stable source IDs for idempotency. Draft, pending or failed payment/booking/transfer states create no verified activity. Sign-out clears personalized feed/profile caches while public discovery remains usable. Payment amounts, wallet addresses, receipts and detailed redemption history remain private.

## 10. Definition of done

1. Public copy and How it works explain the access/community proposition without challenge or reaction promises.
2. Guests discover supported businesses, memberships, passes, classes and events on mobile/desktop without an account.
3. Email accounts and personal/club wallet authority remain distinct and reject browser-selected privilege.
4. A fitness business offers one frozen membership product and receives a verified Devnet EURC purchase.
5. The purchaser sees valid membership state and transfers the remaining whole entitlement once under resolved P09–P11 rules; the recipient accepts and becomes holder without double ownership.
6. Authorized staff redeems membership access once and concurrent transfer/redemption cannot double-use it.
7. A user buys a dated pass with real test EURC, receives recoverable access, and staff confirms one visit under resolved P01/P07.
8. An ordinary paid event ticket is issued/redeemed once under disclosed event policy.
9. A sponsored event discloses who funds attendee access, issues bounded tickets/discount and reconciles host payment/unused funds under resolved P12 without a winner.
10. Explicitly shared verified participation appears chronologically across permitted users; following and privacy work without reactions.
11. Duplicate requests, lost responses, unknown chain outcomes, insufficient funds, expiry, cancellation and authorization failures have meaningful tests and visible recovery.
12. Real Devnet receipts and projections survive refresh/restart; fresh demo data never pretends chain history was reset.

## 11. Delivery milestones

<a id="m0--foundation-and-frozen-product-contracts"></a>

### M0 — Foundation and frozen product contracts

Complete account/profile, personal/club wallet proof, protected context and hosted staging. COR0005's public access-product terms and interface transition are complete. Resolve P01, P07 and enough of P09–P12 to prepare implementation tickets.

**Exit:** two isolated accounts; real wallet connect/proof lifecycle; public access catalogue/guide; no challenge/reaction current promise; reviewed membership, pass, event and sponsorship boundaries.

### M1 — Persistent access catalogue and operations

Persist businesses, membership/pass products, classes, events, private drafts, follows/bookmarks, reservations, redemptions and idempotent delivery foundations. Keep fixtures distinct from real state.

**Exit:** guest-safe catalogue, owner/organization authorization, two-account isolation, restart-safe drafts, capacity and redemption constraints.

### M2 — Membership program and Devnet lifecycle

Build/test/deploy the bounded membership program and integrate purchase, projection, transfer/acceptance and recovery with personal/club wallets.

**Exit:** authority/time/concurrency tests; actual test-EURC purchase; verified holder state; permitted transfer; staff redemption; wrong signer/mint/account substitution and duplicate use rejected.

### M3 — Passes, events and sponsorship

Deliver pass reservation/payment/refund and event purchase/redemption. Add one sponsored-event funding flow only after P12 is frozen.

**Exit:** real paid pass and eligible return, last-seat safety, event ticket/benefit redemption, sponsored-access receipt/allocation and recovery with no competition semantics.

<a id="m4--social-loop-and-demo-delivery"></a>

### M4 — Minimal community loop and demo

Deliver follows, chronological shared participation, privacy/hiding, public links and the short integrated demo. No reactions or challenge activity.

**Exit:** a second user follows an author, sees an explicitly shared verified access/attendance item, opens the public detail and independently obtains access; private/hidden data remains denied.

## 12. Acceptance matrix

| ID  | Scenario                                   | Required result                                                                                                                           |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Guest Explore/guide/direct link            | Supported public catalogue/details work without wallet/login; only safe fields and honest preview state appear.                           |
| A02 | Protected action while signed out          | Sign-in prompt preserves safe intent; return rechecks eligibility and never automatically signs/transacts.                                |
| A03 | New/returning email account                | Exactly one profile/dataset participant; no membership, business role, wallet or paid access created by signup.                           |
| A04 | Personal/club wallet mismatch              | Wrong, merely connected or unproved wallet cannot purchase/transfer/manage business funds.                                                |
| A05 | Membership product publication             | Authorized business freezes issuer, version, price, validity, visits and transfer terms; text host/business claims grant no authority.    |
| A06 | Membership purchase success                | Exact Devnet EURC payment and entitlement assignment reconcile once; finalized evidence drives active state.                              |
| A07 | Membership payment unknown/fails           | No false active membership or second charge; existing attempt is recovered/reobserved first.                                              |
| A08 | Membership transfer success                | Current holder initiates, eligible recipient accepts, remaining entitlement moves once and prior use persists.                            |
| A09 | Invalid/concurrent transfer                | Expired/frozen/exhausted/wrong-holder/ineligible/duplicate transfer fails; transfer/redemption race cannot double-use.                    |
| A10 | Wallet replacement/recovery                | Durable account and verified replacement policy preserve or deliberately migrate access; connection change alone does not transfer it.    |
| A11 | Staff membership redemption                | Assigned staff consumes one valid visit; attendee/unrelated venue/duplicate request fails.                                                |
| A12 | Pass purchase and last seat                | Verified payment plus valid hold confirms once; concurrent attempts do not oversell.                                                      |
| A13 | Pass cancellation/no-show/business failure | Confirmed C08 and resolved P01 apply; owed return remains pending until verified transfer.                                                |
| A14 | Ordinary event ticket                      | One verified payment issues one ticket and authorized host redeems it once; no gym visit implied.                                         |
| A15 | Sponsored-event publication                | Sponsor, host, budget/discount, quantity, policy and unused-fund behavior are disclosed; no winner/vote/prize language.                   |
| A16 | Sponsored funding/recovery                 | Verified funding cannot over-issue subsidized tickets; cancellation and unused funds follow frozen recipients without duplicate transfer. |
| A17 | Follow/feed                                | Follow is unique/idempotent; Community/Following paginate chronologically and have useful empty states.                                   |
| A18 | Activity sharing                           | Only explicitly shared verified source state publishes once; draft/pending/failed activity does not appear.                               |
| A19 | Social privacy                             | Guest/cross-dataset/hidden/revoked access reveals no personal activity, private counts, receipts or wallet data.                          |
| A20 | No reactions/challenges                    | Current UI/API/schema has no product challenge or reaction behavior; wallet-authentication nonces still work.                             |
| A21 | Legacy preview storage                     | Obsolete challenge/reaction fields are discarded without erasing supported event/follow/preferences.                                      |
| A22 | Responsive/accessibility                   | Core flows and guide work at phone/desktop widths with keyboard focus, readable state/error copy and no overflow.                         |
| A23 | Asset integrity                            | Every financial flow uses configured Devnet EURC; wrong mint/program/recipient/cluster fails and test labels remain visible.              |
| A24 | Restart/retry integrity                    | Server/browser restart and lost response do not duplicate payment, entitlement, transfer, ticket or redemption.                           |

## 13. Demo script

Use a concise main recording with separate recovery evidence.

1. **Understand:** Open the rewritten public guide. Show memberships, passes, events and sponsored access in the `Discover → Access → Participate → Connect` loop.
2. **Discover:** Browse a seeded fitness business, its transferable membership, a dated class pass, an ordinary event and a sponsored event without signing in.
3. **Purchase membership:** Sign in, use the linked personal wallet to approve a real test-EURC purchase to the authorized club context, and show pending versus finalized state honestly.
4. **Use and transfer:** Show one authorized staff redemption, then transfer the remaining entitlement to a second signed-in user's proved wallet under the frozen rule. Show recipient acceptance and the single current holder.
5. **Pass/event variants:** Show a dated pass purchase/reservation and an event ticket. Explain the sponsored event's attendee discount/funding without a winner or prize.
6. **Connect:** Explicitly share verified participation, follow the author from the second account and open the chronological item to the public detail. There is no reaction action.
7. **Recovery evidence:** Keep wrong-wallet, duplicate transfer/redemption, expired access, unknown payment, eligible refund and sponsorship cancellation/unused-fund examples inspectable outside the short main path.

Do not fake Devnet time, payment, partners or inventory. Prepared elapsed-time fixtures and recorded genuine receipts may support the demo when live timing is impractical, but they must be identified accurately.

## 14. Stretch and follow-up boundaries

The confirmed core is the bounded membership purchase/transfer lifecycle, paid passes, ordinary/sponsored events, staff redemption and minimal shared participation. Defer multi-gym credit networks, collaborative revenue sharing, paid peer-to-peer resale, marketplaces, recurring billing, NFTs/token interoperability, production partner integrations, reactions, comments, messages, notifications, rankings, generalized posts and challenges.

Also defer production identity/recovery/fraud/dispute operations, fiat custody/conversion, bank/card rails, fee sponsorship, unattended signing, multiple personal wallets, large-scale reconciliation, real-money balances and production legal/compliance claims. Before a real-money or live-partner pilot, separately resolve target market, business agreements, consumer cancellation/refund rights, sponsor/host obligations, privacy, disputes, fraud and applicable payment/resale requirements.

The current frontend has an access-focused public guide, navigation and honest My Access empty state. Documentation and presentation of target behavior are not evidence of delivered membership, payment, sponsorship or program functionality.
