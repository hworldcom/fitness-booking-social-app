# RepX Club

**Social fitness, onchain.**

RepX Club is a community fitness platform for discovering local classes and events, creating challenges, and sharing meaningful activity with other members. It brings individuals, trainers, gyms, cafés, and community organizers into one product where people can find something to join and organizers can turn existing fitness communities into structured experiences.

The MVP supports two challenge models: community challenges funded by their participants and decided by participant voting, and sponsored challenges funded by a creator who selects the winner. It also covers dated class passes, paid community events, gym-confirmed attendance, public activity sharing, follows, and lightweight reactions. Booking, payment, attendance, and social activity remain separate states so a post or wallet transaction cannot be mistaken for a verified visit.

Solana provides the financial settlement layer for the hackathon demo. Participants connect prepared Phantom wallets, while financially active companies use distinct company wallets. Those wallets will approve Devnet transactions using test EURC for passes, event tickets, challenge pools, payouts and returns; test SOL is used only for network costs. Product discovery, application identity, permissions and social data stay in the backend rather than being placed onchain. Embedded Phantom onboarding remains a later refinement because the Phantom Developer Portal currently pauses new developer sign-ups.

**Current status:** the responsive Next.js frontend preview is implemented with typed fixtures and browser-local persistence. It demonstrates discovery, challenge and event planning, class-pass checkout previews, and social interactions without moving funds or creating reservations. The local Supabase schema/migration foundation, server-only Drizzle boundary and verified protected-actor context are implemented and validated, but product screens do not read persistent protected product data yet. Completed DEV0027 delivered the normal Phantom extension connection UI, completed DEV0038 delivered the separate Phantom message-signature/Supabase session boundary, completed DEV0039 added prepared Anna enrollment plus a durable personal wallet binding, completed DEV0040 added row-level-security-backed protected access and route guards, and completed DEV0048 removed the superseded gym-membership path. Ready DEV0046 is next and will implement email-OTP registration. Persistent product repositories, balances, transaction signatures, real Devnet payments and the Solana challenge program remain unimplemented.

**Start with the [MVP specification](docs/mvp-spec.md).** It is the single current product document, including project status, scope, architecture, milestones, acceptance checks, and the demo script.

## Where information belongs

| Location                                             | Responsibility                                                                                                                                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [docs/mvp-spec.md](docs/mvp-spec.md)                 | What we are building, how it should behave, and the delivery plan. Update this file when product/design decisions change.                                                                                |
| [AGENTS.md](AGENTS.md)                               | Contributor rules: ticket-first work, implementation records, validation, and commits.                                                                                                                   |
| [tickets/README.md](tickets/README.md)               | Work-record index and status. Current and archived records are grouped as `frontend`, `backend`, `blockchain`, or `organisatory`; separate templates cover development tickets and coordination records. |
| [docs/archive/2026-09-18/](docs/archive/2026-09-18/) | Superseded drafts retained for historical context. They do not define current requirements.                                                                                                              |

<a id="planned-backend-work"></a>

## Backend and wallet work

The [database and authentication plan](docs/mvp-spec.md#database-provider-recommendation--19-september-2026) uses Supabase PostgreSQL and scopes the next steps. Completed [DEV0015](tickets/archive/backend/DEV0015-supabase-database-foundation.md) contains the local configuration, first migration, deterministic seed, database tests and server Drizzle mappings; completed [DEV0025](tickets/archive/backend/DEV0025-nextjs-backend-boundary.md) owns their server-only/import enforcement. Completed [DEV0027](tickets/archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md) establishes the prepared Phantom extension connection, completed [DEV0038](tickets/archive/backend/DEV0038-phantom-supabase-web3-authentication.md) establishes the local Supabase Web3 session, completed [DEV0039](tickets/archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md) establishes prepared Anna enrollment and the shared wallet-binding contract, and completed [DEV0040](tickets/archive/backend/DEV0040-protected-access-and-database-context.md) establishes protected actor/database access. Ready [DEV0046](tickets/current/backend/DEV0046-email-otp-registration-and-application-profiles.md) is the next user-prioritized implementation and will add email one-time-passcode registration plus application profiles; Draft [DEV0047](tickets/current/backend/DEV0047-personal-wallet-linking-and-replacement.md) follows with optional personal-wallet linking. [COR0002](tickets/current/organisatory/COR0002-phantom-auth-and-demo-access.md) remains open for deferred company-wallet authorization in DEV0041. No hosted Supabase project or persistent product database mode exists yet. The [social contract and data design](docs/mvp-spec.md#9-social-behavior-and-permissions) and [tickets DEV0023–DEV0024](tickets/README.md#ticket-index) cover the accepted social refinement; shared feeds, Cheers and verified challenge activity are planned, not implemented.

## Run locally

Use Node.js 24.21.0 LTS and npm 11. The Node version is pinned in `.nvmrc`, the supported major range is enforced by `package.json`, and dependency versions are pinned in `package-lock.json`. After opening a new terminal, verify `node --version` reports `v24.21.0` before installing dependencies. For browsing, reviewing or demonstrating the app, use the optimized preview:

```sh
npm ci
npm run build
npm run start
```

Open [localhost:3100](http://localhost:3100). No environment variables, wallet, database or external service account are required for public preview browsing. Wallet sign-in uses the optional local Auth setup below.

The preview serves already-built pages, avoiding route compilation while you navigate. After changing application code, stop the preview, run `npm run build` again and restart `npm run start` to see the changes.

For active development with automatic updates as you edit:

```sh
npm run dev
```

Development mode compiles routes when first visited and recompiles after changes, so navigation can take several seconds and show Next.js's rendering indicator. This is development overhead; measure demo performance using the optimized preview. The investigation and local timings are recorded in [ticket DEV0021](tickets/archive/frontend/DEV0021-local-preview-navigation-performance.md).

Both modes use port 3100. Stop the existing server with Ctrl+C before switching modes, then refresh your browser once to load the new client. Switching modes on the same address preserves this browser's saved preview data.

## Local database foundation

Database work is optional for the current frontend preview. To validate the in-progress foundation, start Docker Desktop and run:

```sh
npm run db:start
npm run db:reset
npm run db:runtime
npm run db:test
npm run test:db
npm run db:lint
```

The isolated local workflow uses database port `55322`, avoiding Supabase's default range. DEV0015's `db:start` launches PostgreSQL only; Auth, the Data API, Realtime, Storage and Studio remain disabled until their owning feature ticket needs them. `db:reset` recreates only this repository's disposable local database from checked-in SQL and seeds it. Do not use a linked reset on hosted data. Run `db:runtime` after each reset to create the restricted loopback application login used by DEV0039. `test:db` uses both the local test credential and that restricted login; application runtime credentials are supplied only through the server-side `DATABASE_URL` shown in `.env.example`. See [the database operations guide](supabase/README.md) for seed-idempotency, role and hosted-migration details.

## Local Phantom sign-in

Sign-in is optional for public browsing. To exercise it, start Docker Desktop. If the database-only stack is already running, stop it first, then launch the Auth-enabled profile and print its public connection values:

```sh
npm run db:stop
npm run auth:start
npm run auth:status
npm run db:runtime
```

Create an ignored `.env.local` from `.env.example`. The status command intentionally prints only public values: copy `API_URL` to `NEXT_PUBLIC_SUPABASE_URL`, copy `ANON_KEY` to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and keep `NEXT_PUBLIC_SITE_URL=http://localhost:3100`. Never substitute `SERVICE_ROLE_KEY`. For the disposable loopback database, set `DATABASE_URL` to the restricted local login documented in [the database operations guide](supabase/README.md), then set `PREPARED_PERSONAL_IDENTITIES_JSON` to the server-only prepared address-to-Anna mapping. Public wallet addresses may be stored, but never place a private key or recovery phrase in an environment file.

Build or restart the app after changing environment variables, open [the exact sign-in route](http://localhost:3100/sign-in), connect the prepared Phantom account and approve the readable login message. The prompt is not a transaction and costs no SOL. After Supabase verifies that proof, the server automatically enrolls the configured wallet as Anna; enrollment does not ask Phantom for a second signature. Disconnecting Phantom keeps the Supabase session and saved Anna association while clearly disabling later wallet-required actions until the same wallet reconnects.

The local profile enables Solana Web3 Auth and permits 30 Web3 login requests per five minutes. CAPTCHA is intentionally absent on loopback-only development; a public hosted rollout needs a separate abuse-control decision. The server verifies and refreshes cookie sessions, while wallet connection, Supabase authentication, application profile and durable wallet binding stay separate. If Auth, the database or required variables are absent, authenticated state fails closed and public preview routes remain usable.

Recovery is local and disposable: sign out in the application to clear this browser session, use `npm run db:stop` to stop the stack, and restart with `npm run auth:start`. A reset removes local Auth users together with the disposable database. No hosted project is linked by DEV0038.

## What you can try

The [frontend foundation ticket](tickets/archive/frontend/DEV0008-repx-club-frontend.md) records the original slice. Explore Feed, Explore, Challenges and Profile; filter the demonstration catalogue; follow people; save challenges; create community or sponsored challenge drafts; discover Run & Coffee under Explore → Events and save a paid-event draft; and preview the class-pass checkout on any class. Checkout previews create no payment, pass, reservation or feed activity. Drafts and choices persist in this browser; **Profile → Reset preview** clears them.

The [discovery and guidance refinement](tickets/archive/frontend/DEV0020-discovery-and-how-it-works.md) adds **How it works**, global catalogue search, challenge activity/search/sort controls, comparable card details, public copy links and related activities.

The header wallet control discovers Phantom through Wallet Standard on Solana Devnet. It can connect, show the public address and disconnect without authenticating. The separate `/sign-in` page can ask that connected wallet to approve a readable login message and establish a server-verified Supabase session. A private server roster and constrained database function then map the configured address to Anna and the active demo dataset without a second wallet prompt. The flow never requests a transaction or reads balances. A different connected account is shown as a mismatch and is never merged into the saved identity.

This is a frontend preview. People, venue schedules, visit history, prize pools and balances are explicitly labelled examples. Payment and entry buttons open informational previews, with no real signatures, funds, reservations, attendance confirmations or published challenges. Gym memberships are outside the current MVP. Paid passes/event tickets, authorized host redemption, gym operations, persistent product repositories and Phantom/Devnet transactions remain outstanding; see the [current implementation status](docs/mvp-spec.md) and its acceptance criteria.

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

The database commands above add SQL catalogue/constraint/RLS checks and Drizzle integration coverage. They require the isolated local stack and are intentionally separate from the configuration-free `npm test` preview suite.

## Application structure

- `src/app/`: thin Next.js App Router adapters, shared layout and visual styles.
- `src/features/`: capability-owned Feed, Explore/discovery, challenge, event, class and profile screens.
- `src/domain/`: framework-independent catalogue/event contracts and deterministic challenge/discovery rules; no browser, network or persistence authority.
- `src/features/preview/`: typed demonstration catalogue, derived discovery data, validated local state transitions and browser persistence under `repx-club-preview-v1`; never live inventory, authorization, payment proof or a financial ledger.
- `src/solana/client/`: browser-safe, Devnet-only Phantom discovery/connection state and accessible wallet presentation; no RPC, authentication, balance or transaction authority.
- `src/auth/`: public Auth/identity response contracts, bounded presentation rules and the browser-only Phantom-to-Supabase message and identity clients.
- `src/server/auth/`: server-only Supabase client and verified session boundary; `src/proxy.ts` refreshes session cookies without protecting public routes.
- `src/server/identity/`: server-only prepared-roster validation and application enrollment service.
- `src/server/db/`: server-only environment parsing, bounded Postgres.js connection, Drizzle mappings and the narrow prepared-identity repository. Other feature repositories arrive in their owning later tickets.
- `src/components/`: application shell, presentation formatting and reusable accessible interface/discovery controls.
- `supabase/`: local configuration, the sole SQL migration history, deterministic seeds and database tests.
- `tests/`: domain checks and Playwright browser flows.
- `public/`: local branding and artwork. The running-club image was generated for RepX Club on 19 September 2026 using OpenAI image generation and exported as WebP. Its people and setting are illustrative. Other graphics are CSS/SVG with Lucide icons. Manrope and Bricolage Grotesque are self-hosted through Fontsource; the app does not fetch external fonts or stock imagery. The [visual asset record](docs/design/DEV0043-assets.md) documents the illustrative studio photos and preferred redesign reference.

The staged frontend/backend/database/blockchain directory plan is tracked by [Coordination COR0001](tickets/current/organisatory/COR0001-project-structure.md). That non-implementation record maps focused peer development tickets and does not claim target directories exist before their owning code is delivered.

Keep product requirements in the specification, workflow rules in `AGENTS.md`, and implementation evidence in tickets. This README owns setup and repository navigation.
