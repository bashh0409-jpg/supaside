# Backend

This folder contains server-only behavior:

- `http/` contains the implementations for Next.js route handlers.
- `email/` contains server-side email delivery.

Expose a handler through a minimal file in `app/api/` or `app/auth/` so URLs
remain owned by the Next.js router. Database schema and migrations live in the
root `supabase/` directory. Never import backend modules from `frontend/`.
