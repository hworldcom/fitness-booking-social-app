# MovX Club

**Social fitness, onchain.**

MovX Club is a community fitness platform for discovering local classes and events, creating challenges, and sharing meaningful activity with other members. It brings individuals, trainers, gyms, businesses, and community organizers into one product where people can find something to join and organizers can turn existing fitness communities into structured experiences.

The MVP supports two challenge models: community challenges funded by their participants and decided by participant voting, and sponsored challenges funded by a creator who selects the winner. It also covers dated class passes, paid community events, gym-confirmed attendance, public activity sharing, follows, and lightweight reactions. Booking, payment, attendance, and social activity remain separate states so a post or wallet transaction cannot be mistaken for a verified visit.

Solana provides the financial settlement layer for the hackathon demo. Participants create application accounts with email and may later link a Phantom wallet, while financially active fitness and sports clubs use distinct club wallets. Club administrators sign in individually through the same email system and then enter an authorized club workspace; clubs never share a separate application login identity. Those wallets will approve Devnet transactions using test EURC for passes, event tickets, challenge pools, payouts and returns; test SOL is used only for network costs. Product discovery, application identity, permissions and social data stay in the backend rather than being placed onchain. Embedded Phantom onboarding remains a later refinement because the Phantom Developer Portal currently pauses new developer sign-ups.

**Current status:** the responsive Next.js frontend preview is implemented with typed fixtures and browser-local persistence. It demonstrates discovery, challenge and event planning, class-pass checkout previews, and social interactions without moving funds or creating reservations. The local Supabase schema/migration foundation, server-only Drizzle boundary and verified protected-actor context are implemented and validated, but product screens do not read persistent protected product data yet. Completed DEV0027 delivered the normal Phantom extension connection UI; completed DEV0038–DEV0040 preserve the historical wallet-first Auth, enrollment and protected-context evidence; completed DEV0046 replaces that personal entry path with open email one-time-passcode (OTP) accounts, minimal profiles and wallet-independent protected access; and completed DEV0048 removed the superseded gym-membership path. DEV0047 is in progress and is adding optional personal-wallet linking. Persistent product repositories, balances, transaction signatures, real Devnet payments and the Solana challenge program remain unimplemented.

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

The [database and authentication plan](docs/mvp-spec.md#database-provider-recommendation--19-september-2026) uses Supabase PostgreSQL and scopes the next steps. Completed [DEV0015](tickets/archive/backend/DEV0015-supabase-database-foundation.md) contains the local configuration, first migration, deterministic seed, database tests and server Drizzle mappings; completed [DEV0025](tickets/archive/backend/DEV0025-nextjs-backend-boundary.md) owns their server-only/import enforcement. Completed [DEV0027](tickets/archive/blockchain/DEV0027-phantom-wallet-connection-foundation.md) establishes Phantom extension connection, while completed [DEV0038](tickets/archive/backend/DEV0038-phantom-supabase-web3-authentication.md), [DEV0039](tickets/archive/backend/DEV0039-prepared-identity-and-wallet-bindings.md) and [DEV0040](tickets/archive/backend/DEV0040-protected-access-and-database-context.md) retain the superseded wallet-first path and reusable protected-context history. Completed [DEV0046](tickets/archive/backend/DEV0046-email-otp-registration-and-application-profiles.md) now owns open email-code accounts, minimal application profiles and wallet-independent protected access; in-progress [DEV0047](tickets/current/backend/DEV0047-personal-wallet-linking-and-replacement.md) adds optional personal-wallet linking. [COR0002](tickets/current/organisatory/COR0002-phantom-auth-and-demo-access.md) remains open for deferred [DEV0041 club-wallet authorization](tickets/current/backend/DEV0041-club-wallet-authorization.md); completed [DEV0051](tickets/archive/frontend/DEV0051-club-value-proposition-and-sign-in-entry.md) adds the public club proposition and club-oriented sign-in entrance. No persistent product repository exists yet; hosted Supabase deployment/configuration is separate from the validated local workflow. The [social contract and data design](docs/mvp-spec.md#9-social-behavior-and-permissions) and [tickets DEV0023–DEV0024](tickets/README.md#ticket-index) cover the accepted social refinement; shared feeds, Cheers and verified challenge activity are planned, not implemented.

## Run locally

Use Node.js 24.21.0 LTS and npm 11. The Node version is pinned in `.nvmrc`, the supported major range is enforced by `package.json`, and dependency versions are pinned in `package-lock.json`. After opening a new terminal, verify `node --version` reports `v24.21.0` before installing dependencies. For browsing, reviewing or demonstrating the app, use the optimized preview:

```sh
npm ci
npm run build
npm run start
```

Open [localhost:3100](http://localhost:3100). No environment variables, account, wallet, database or external service are required for public preview browsing. Email sign-in uses the optional local Auth setup below.

The preview serves already-built pages, avoiding route compilation while you navigate. After changing application code, stop the preview, run `npm run build` again and restart `npm run start` to see the changes.

For active development with automatic updates as you edit:

```sh
npm run dev
```

Development mode compiles routes when first visited and recompiles after changes, so navigation can take several seconds and show Next.js's rendering indicator. This is development overhead; measure demo performance using the optimized preview. The investigation and local timings are recorded in [ticket DEV0021](tickets/archive/frontend/DEV0021-local-preview-navigation-performance.md).

Both modes use port 3100. Stop the existing server with Ctrl+C before switching modes, then refresh your browser once to load the new client. Switching modes on the same address preserves this browser's saved preview data.

## Cloudflare Workers compatibility

The additive vinext toolchain builds the existing Next.js application for Cloudflare Workers while the standard Next.js commands above remain available. It targets the staging-only Worker name `movx-club-staging`; no Worker or custom domain is deployed by the runtime-foundation work.

```sh
npm run dev:vinext
npm run build:vinext
npm run start:vinext
```

The vinext development and built-Worker servers use [localhost:3102](http://localhost:3102), avoiding the standard preview on 3100 and Playwright on 3101. Build the Worker before `start:vinext`; generated `dist/`, `.vinext/` and `.wrangler/` output stays untracked.

The initial staging configuration uses Cloudflare Images for the existing public artwork. Persistent application data/page caching and global route pre-rendering are deliberately disabled until dynamic Auth, profile and database behavior has been validated on the custom staging origin.

A hosted build requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and the exact `NEXT_PUBLIC_SITE_URL` at build time and in the Worker environment. The Worker additionally receives `DATABASE_URL` as a runtime secret. Never put the database URL, migration credentials, Supabase secret/service-role keys or mail credentials in browser-visible variables or committed Wrangler configuration. The current variable contract remains documented in [.env.example](.env.example); hosted Supabase provisioning and the first release belong to DEV0055 and DEV0056.

The guarded staging deployment reads those four values from the ignored, owner-only `.env.staging.local`, validates the exact staging project/origin and transaction-pooler login, and passes only those approved names to Wrangler through a temporary owner-only secrets file that is removed after the command. Validation and dry-run modes do not create a Worker; a real deployment also refuses a dirty worktree so the release always identifies a commit:

```sh
npm run deploy:staging:check
npm run deploy:staging:dry-run
npm run deploy:staging
```

The first real release targets only the generated `workers.dev` hostname. Do not add a route or Custom Domain to `wrangler.jsonc`; DNS delegation, Cloudflare Access and `staging.movx.club` remain separate gated steps in DEV0056.

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

## Local email sign-in

Sign-in is optional for public browsing. To exercise it, start Docker Desktop. If the database-only stack is already running, stop it first, then launch the Auth-enabled profile and print its public connection values:

```sh
npm run db:stop
npm run auth:start
npm run auth:status
npm run db:runtime
```

Create an ignored `.env.local` from `.env.example`. The status command intentionally prints only public values: copy `API_URL` to `NEXT_PUBLIC_SUPABASE_URL`, copy `PUBLISHABLE_KEY` (or the legacy `ANON_KEY`) to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and keep `NEXT_PUBLIC_SITE_URL=http://localhost:3100`. Never substitute `SECRET_KEY` or `SERVICE_ROLE_KEY`. Set `DATABASE_URL` to the restricted loopback login documented in [the database operations guide](supabase/README.md). No prepared-person or wallet roster is needed.

Build or restart the app after changing environment variables, open [the exact sign-in route](http://localhost:3100/sign-in), enter an email and open [the local captured mailbox](http://127.0.0.1:55324) to read the six-digit code. The first verified login asks for a display name and atomically creates one user profile plus one ordinary participation row in the active application dataset. Returning codes restore the same profile. No wallet connection or signature is requested.

The local profile captures mail instead of sending it externally, permits 30 test emails per hour and limits code verification attempts. CAPTCHA is intentionally absent on loopback-only development; a public hosted rollout needs reviewed abuse controls, allowed origins, the same OTP template and a custom SMTP provider. The server verifies and refreshes cookie sessions, while the Auth account, application profile and optional future wallet binding stay separate. If Auth, the database or required variables are absent, authenticated state fails closed and public preview routes remain usable.

Recovery uses another code sent to the same verified email. Sign out in the application to clear this browser session. `npm run db:stop` stops the local stack; `npm run db:reset` deliberately removes local Auth users and application profiles, after which they can register again. No hosted project is linked by DEV0046.

## What you can try

The [frontend foundation ticket](tickets/archive/frontend/DEV0008-repx-club-frontend.md) records the original slice. Explore Feed, Explore, Challenges and Profile; filter the demonstration catalogue; follow people; save challenges; create community or sponsored challenge drafts; discover Run & Coffee under Explore → Events and save a paid-event draft; and preview the class-pass checkout on any class. Checkout previews create no payment, pass, reservation or feed activity. Drafts and choices persist in this browser; **Profile → Reset preview** clears them.

The [discovery and guidance refinement](tickets/archive/frontend/DEV0020-discovery-and-how-it-works.md) adds **How it works**, global catalogue search, challenge activity/search/sort controls, comparable card details, public copy links and related activities.

The header wallet control discovers Phantom through Wallet Standard on Solana Devnet. It can connect, show the public address and disconnect without authenticating or linking the wallet. The separate `/sign-in` page uses email OTP for the application account. In-progress DEV0047 adds an explicit message-only proof for optional wallet linking; connection alone still grants no identity, role, payment evidence or automatic account merge.

This is a frontend preview. People, venue schedules, visit history, prize pools and balances are explicitly labelled examples. Payment and entry buttons open informational previews, with no real signatures, funds, reservations, attendance confirmations or published challenges. Gym memberships are outside the current MVP. Paid passes/event tickets, authorized host redemption, gym operations, persistent product repositories and Phantom/Devnet transactions remain outstanding; see the [current implementation status](docs/mvp-spec.md) and its acceptance criteria.

## Checks

```sh
npm test
npm run test:auth
npm run test:wallet-auth
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run test:e2e
```

Domain tests cover validation, local state transitions, sharing privacy and storage recovery. `test:auth` requires the Auth-enabled local stack, Mailpit and an already-running configured app on port 3100; it creates disposable email accounts and proves new/returning login, invalid-code recovery, profile isolation and sign-out. `test:wallet-auth` requires that same app to use the local public Supabase values rather than hosted credentials; it creates two disposable accounts and generated test-only Solana keys to exercise the same-origin challenge/proof/link/replace/collision/unlink HTTP path. It never constructs a transaction and does not replace the required real Phantom interface rehearsal. Browser tests exercise desktop and mobile layouts and keyboard flows using **installed Google Chrome**. Build first; Playwright starts a separate production server on port 3101 and refuses to reuse an existing server, so another local project cannot be mistaken for MovX Club. Browser evidence and failure traces go to ignored `test-results/`. In restricted agent environments, the test runner, build worker and browser/server may require permission to use local IPC/ports.

The database commands above add SQL catalogue/constraint/RLS checks and Drizzle integration coverage. They require the isolated local stack and are intentionally separate from the configuration-free `npm test` preview suite.

## Application structure

- `src/app/`: thin Next.js App Router adapters, shared layout and visual styles.
- `src/features/`: capability-owned Feed, Explore/discovery, challenge, event, class and profile screens.
- `src/domain/`: framework-independent catalogue/event contracts and deterministic challenge/discovery rules; no browser, network or persistence authority.
- `src/features/preview/`: typed demonstration catalogue, derived discovery data, validated local state transitions and browser persistence under the legacy compatibility key `repx-club-preview-v1`; never live inventory, authorization, payment proof or a financial ledger. DEV0049 retains that opaque key so the MovX Club rename does not discard existing browser choices.
- `src/solana/client/`: browser-safe, Devnet-only Phantom discovery/connection state and accessible wallet presentation; no RPC, authentication, balance or transaction authority.
- `src/auth/`: public Auth/identity response contracts, bounded email/code rules and the browser-side Supabase session/identity clients.
- `src/server/auth/`: server-only Supabase client and verified session boundary; `src/proxy.ts` refreshes session cookies without protecting public routes.
- `src/server/identity/`: server-only application-profile enrollment and lookup service.
- `src/server/db/`: server-only environment parsing, bounded Postgres.js connection, Drizzle mappings and narrow identity/authorization repositories. Other feature repositories arrive in their owning later tickets.
- `src/components/`: application shell, presentation formatting and reusable accessible interface/discovery controls.
- `supabase/`: local configuration, the sole SQL migration history, deterministic seeds and database tests.
- `tests/`: domain checks and Playwright browser flows.
- `public/`: local branding and artwork. The running-club image was generated for the original preview on 19 September 2026 using OpenAI image generation and exported as WebP. Its people and setting are illustrative. Other graphics are CSS/SVG with Lucide icons. Manrope and Bricolage Grotesque are self-hosted through Fontsource; the app does not fetch external fonts or stock imagery. The [visual asset record](docs/design/DEV0043-assets.md) documents the illustrative studio photos and preferred redesign reference.

The staged frontend/backend/database/blockchain directory plan is tracked by [Coordination COR0001](tickets/current/organisatory/COR0001-project-structure.md). That non-implementation record maps focused peer development tickets and does not claim target directories exist before their owning code is delivered.

Keep product requirements in the specification, workflow rules in `AGENTS.md`, and implementation evidence in tickets. This README owns setup and repository navigation.
