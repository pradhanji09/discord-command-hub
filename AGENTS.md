# AGENTS.md

## Project

Discord slash-command bot with an admin dashboard. Discord posts signed
interactions to our backend; we verify, dedup, record, reply, and mirror a
notification to a second channel. Admins view logs and config in a web app.

## Stack

- Backend: Node.js, Fastify (backend/)
- Frontend: React, Vite (frontend/)
- Database: Supabase Postgres, accessed only from the backend
- Hosting: backend on AWS (HTTPS required), frontend on Vercel

## Commands

- Backend dev: `cd backend && npm run start:dev`
- Frontend dev: `cd frontend && npm run start:dev`

## Architecture

Feature modules live under `backend/src/<feature>/`, structured into layers with plain factory-based dependency injection:
`routes -> handler -> service -> repository`. Dependencies point downward only.

File naming follows layer suffixes (`<name>.routes.js`, `<name>.handler.js`, `<name>.service.js`, `<name>.repository.js`).

- routes: composition root for the feature. Registers URLs, methods, hooks, and schemas. Plain factory functions wire dependencies: `createInteractionsRepository(fastify.db)` -> `createInteractionsService({ repo })` -> `createInteractionsHandlers({ service })`. Contains no business logic.
- handler: thin request/response shaping. Extracts payload, calls the service, sends the HTTP reply. No business rules and no database code.
- service: pure business rules. Receives repositories via factory arguments. Knows nothing about Fastify request/reply objects or SQL. The feature dispatcher (e.g. `discordInteractions.service.js`) only routes by interaction type to dedicated action services (`handlePing.js`, `handleSlashCommand.js`).
- repository: the only place that queries the database using Knex. Each repository is created via a factory (e.g. `createInteractionsRepository(db)`).

Shared code (config, logger, db, errors) lives in `backend/src/common/`.
Each slash command is its own handler registered by name (no big if/else).
Mirror channels sit behind one common notifier interface.

## Security and reliability rules (non-negotiable)

1. Verify `X-Signature-Ed25519` and `X-Signature-Timestamp` on the RAW body
   before parsing JSON. Raw-body handling is scoped to `/interactions` only.
   Reject invalid requests with 401. Answer PING (type 1) with PONG.
2. Dedup on interaction ID using a unique database constraint. Insert before
   acting; a duplicate must not trigger a second action.
3. Respond within 3 seconds. Defer, then send a follow-up for slow work
   (mirror notification, AI). The dedup insert and record stay synchronous.
4. A failed downstream call (mirror, AI) must be stored and retried, never dropped.
5. Never log or expose the bot token, public key, webhook URLs, DB credentials,
   or passwords. Secrets come from environment variables only.

## Conventions

- Validate all request input with Fastify schemas.
- Use structured logging; redact secrets.
- Keep `.env.example` updated with variable names only, no real values.

## Git workflow

- Linear history: rebase, no merge commits.
- One small working change per commit, with a clear message.

## Boundaries

- Do not commit `.env` or any secret.
- Do not use paid services or anything requiring a credit card.
- Do not add stretch features (UI-configurable rules, modals, buttons, AI, multi-server)
  until the core flow works end to end.
- Ask before adding new dependencies or changing the folder structure.
