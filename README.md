# RepX Club

**Social fitness, onchain.**

RepX Club is a community fitness platform for discovering local classes and events, creating challenges, and sharing meaningful activity with other members. It brings individuals, trainers, gyms, cafés, and community organizers into one product where people can find something to join and organizers can turn existing fitness communities into structured experiences.

The MVP supports two challenge models: community challenges funded by their participants and decided by participant voting, and sponsored challenges funded by a creator who selects the winner. It also covers dated class passes, paid community events, gym-confirmed attendance, public activity sharing, follows, and lightweight reactions. Booking, payment, attendance, and social activity remain separate states so a post or wallet transaction cannot be mistaken for a verified visit.

Solana provides the financial settlement layer for the hackathon demo. Prepared Phantom wallets will sign Devnet transactions using test EURC for passes, event tickets, challenge pools, payouts, and returns; test SOL is used only for network costs. Product discovery, identity, permissions, and social data stay in the application backend rather than being placed onchain.

**Current status:** the responsive Next.js frontend preview is implemented with typed fixtures and browser-local persistence. It demonstrates discovery, challenge and event planning, membership booking, and social interactions without moving funds. Supabase persistence and authentication, Phantom connection, real Devnet payments, and the Solana challenge program are planned but not yet implemented.

**Start with the [MVP specification](docs/mvp-spec.md).** It is the single current product document, including project status, scope, architecture, milestones, acceptance checks, and the demo script.

## Where information belongs

| Location                                             | Responsibility                                                                                                                                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/mvp-spec.md](docs/mvp-spec.md)                 | What we are building, how it should behave, and the delivery plan. Update this file when product/design decisions change.                                                                                |
| [AGENTS.md](AGENTS.md)                               | Contributor rules: ticket-first work, implementation records, validation, and commits.                                                                                                                   |
| [tickets/README.md](tickets/README.md)               | Work-record index and status. Current and archived records are grouped as `frontend`, `backend`, `blockchain`, or `organisatory`; separate templates cover development tickets and coordination records. |
| [docs/archive/2026-09-18/](docs/archive/2026-09-18/) | Superseded drafts retained for historical context. They do not define current requirements.                                                                                                              |

<a id="planned-backend-work"></a>

## Planned backend and wallet work

The [database and authentication plan](docs/mvp-spec.md#database-provider-recommendation--19-september-2026) recommends Supabase PostgreSQL and scopes the next steps. [Tickets DEV0015–DEV0018](tickets/README.md#ticket-index) are draft implementation work; [ticket DEV0025](tickets/current/backend/DEV0025-nextjs-backend-boundary.md) keeps their application backend in Next.js and starts its server-only boundary with DEV0015. [Ticket DEV0027](tickets/current/blockchain/DEV0027-phantom-wallet-connection-foundation.md) independently establishes the Phantom/Wallet Standard browser connection before DEV0016 adds authenticated identity and bindings. No Supabase project, database, wallet connection, Auth integration or new setup commands are present yet. The local frontend instructions below remain current. The [social contract and data design](docs/mvp-spec.md#9-social-behavior-and-permissions) and [tickets DEV0023–DEV0024](tickets/README.md#ticket-index) cover the accepted social refinement; shared feeds, Cheers and verified challenge activity are planned, not implemented.

## Run locally

Use Node.js 20.9 or newer and npm. Versions are pinned in `package-lock.json`. For browsing, reviewing or demonstrating the app, use the optimized preview:

```sh
npm ci
npm run build
npm run start
```

Open [localhost:3100](http://127.0.0.1:3100). No environment variables, wallet, database or external service account are required for this frontend slice.

The preview serves already-built pages, avoiding route compilation while you navigate. After changing application code, stop the preview, run `npm run build` again and restart `npm run start` to see the changes.

For active development with automatic updates as you edit:

```sh
npm run dev
```

Development mode compiles routes when first visited and recompiles after changes, so navigation can take several seconds and show Next.js's rendering indicator. This is development overhead; measure demo performance using the optimized preview. The investigation and local timings are recorded in [ticket DEV0021](tickets/archive/frontend/DEV0021-local-preview-navigation-performance.md).

Both modes use port 3100. Stop the existing server with Ctrl+C before switching modes, then refresh your browser once to load the new client. Switching modes on the same address preserves this browser's saved preview data.

## What you can try

The [frontend foundation ticket](tickets/archive/frontend/DEV0008-repx-club-frontend.md) records this slice. Explore Feed, Explore, Challenges and Profile; filter the demonstration catalogue; follow people; save challenges; create community or sponsored challenge drafts; discover Run & Coffee under Explore → Events and save a paid-event draft; and try Anna's seeded Kru Tiger membership booking. Sharing, hiding and cancellation update the local feed. Drafts and choices persist in this browser; **Profile → Reset preview** clears them.

The [discovery and guidance refinement](tickets/archive/frontend/DEV0020-discovery-and-how-it-works.md) adds **How it works**, global catalogue search, challenge activity/search/sort controls, comparable card details, public copy links and related activities.

This is a frontend preview. People, venue schedules, visit history, membership, prize pools and balances are explicitly labelled examples. Payment and entry buttons open informational previews, with no real signatures, funds, reservations, attendance confirmations or published challenges. Paid passes/event tickets, authorized host redemption, gym operations, server authorization, database persistence and Phantom/Devnet integration remain outstanding; see the [current implementation status](docs/mvp-spec.md) and its acceptance criteria.

## Checks

```sh
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run test:e2e
```

Domain tests cover validation, local booking transitions, sharing privacy and storage recovery. Browser tests exercise desktop and mobile layouts and keyboard flows using **installed Google Chrome**. Build first; Playwright starts a separate production server on port 3101 and refuses to reuse an existing server, so another local project cannot be mistaken for RepX Club. Browser evidence and failure traces go to ignored `test-results/`. In restricted agent environments, the test runner, build worker and browser/server may require permission to use local IPC/ports.

## Application structure

- `src/app/`: thin Next.js App Router adapters, shared layout and visual styles.
- `src/features/`: capability-owned Feed, Explore/discovery, challenge, event, class and profile screens.
- `src/components/`: application shell and reusable accessible interface/discovery controls.
- `src/lib/fixtures.ts`: typed demonstration catalogue; never live inventory or payment proof.
- `src/lib/demo.ts` and `src/lib/store.ts`: validated local state transitions and browser persistence under `repx-club-preview-v1`; never an authorization or financial ledger.
- `tests/`: domain checks and Playwright browser flows.
- `public/`: local branding and artwork. The running-club image was generated for RepX Club on 19 September 2026 using OpenAI image generation and exported as WebP. Its people and setting are illustrative. Other graphics are CSS/SVG with Lucide icons. Manrope is self-hosted through Fontsource; the app does not fetch external fonts or stock imagery.

The staged frontend/backend/database/blockchain directory plan is tracked by [Coordination COR0001](tickets/current/organisatory/COR0001-project-structure.md). That non-implementation record maps focused peer development tickets and does not claim target directories exist before their owning code is delivered.

Keep product requirements in the specification, workflow rules in `AGENTS.md`, and implementation evidence in tickets. This README owns setup and repository navigation.
