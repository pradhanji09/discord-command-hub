# Project Rules & Architecture Guardrails

## Tech Stack

- **Backend:** Fastify (Node.js)
- **Frontend:** React (Admin Dashboard)
- **Database:** Supabase (PostgreSQL)

## Core Engineering & Security Standards

1. **Signature Verification:** Every incoming request to `/interactions` must verify Discord's `X-Signature-Ed25519` and `X-Signature-Timestamp` headers using the raw request body _before_ parsing JSON.
2. **Idempotency & Dedup:** Prevent duplicate execution by deduplicating incoming requests on their unique interaction ID stored in Supabase.
3. **Response Window:** Always respond or defer to Discord within the 3-second window. Use follow-up API calls for longer tasks (AI triage, database writes, mirror notifications).
4. **Secret Safety:** Never log, print, or expose bot tokens, public keys, webhook URLs, or passwords in logs, client code, or public repository files.
