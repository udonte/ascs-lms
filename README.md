## What this project is

This is the African School of Customer Success LMS: a marketing site plus a paid course platform, both built into a single Next.js 15 app. Students browse courses, pay via Paystack, watch lessons, take quizzes, and get certificates. There's an admin panel for managing all of that. It's a solid mid-size real-world app, good for learning.

## The two frameworks, quickly

**Next.js (App Router)** — instead of one big React app, you build it as a folder structure where folders = URL routes. A folder named `app/courses` becomes the `/courses` page, automatically server-rendered. Some files have special meaning: `page.tsx` (the page itself), `layout.tsx` (shared wrapper, e.g. a sidebar that persists across pages), `loading.tsx` (shown while data is fetching), `not-found.tsx` (404 for that route). Most components in this app are "Server Components" by default — they run on the server, can talk to the database directly, and ship zero JS to the browser. Only things that need clicks/state (`"use client"` at the top of the file) become Client Components.

**Supabase** — a hosted Postgres database plus auth plus file storage. The app talks to it via the `@supabase/ssr` package, which knows how to read/write the user's session from cookies so the server always knows who's logged in.

## How the codebase is organized**Route groups** — folders in parentheses like `(marketing)`, `(auth)`, `(dashboard)`, `(admin)` don't show up in the URL, they just let different sections share different layouts:

- `app/(marketing)/` — public site (home, about, courses listing, contact). Mostly static-ish, SEO-focused.
- `app/(auth)/` — login, signup, forgot/reset password.
- `app/(dashboard)/` — the actual student LMS: browse courses, watch lessons, take quizzes, see certificates. Protected — you must be logged in.
- `app/(admin)/` — internal tool for managing courses, lessons, quizzes, and students. Protected — you must be logged in *and* have the admin role.
- `app/api/webhooks/paystack/route.ts` — a backend-only endpoint Paystack calls when a payment succeeds.
- `app/auth/callback/route.ts` — handles the redirect after magic-link/OAuth login.

Each section has its own `_components/` folder for UI pieces used only there (the underscore prefix tells Next.js "this is not a route, don't try to make a page out of it").

## The "service layer" — the most important pattern here

This is the rule the project enforces (stated explicitly in `AGENTS.md`/`IMPLEMENTATION_GUIDE.md`): **no component is allowed to call Supabase directly**. Instead, all database logic lives in `lib/services/`, organized by feature:

```
lib/services/
  payments/        checkout, paystack init/verify, enrollment fulfillment
  admin/courses/    course & lesson CRUD for admins
  admin/quizzes/    quiz CRUD
  admin/students/   the "ledger" (who paid what, manual access grants)
  dashboard/        student-facing dashboard, settings, certificates
```

A page does `await StudentCourseService.getCourseResumeContext(courseId)` and gets back clean typed data — it never sees a raw `.from("courses").select(...)`. This is genuinely a good pattern to learn from: it keeps UI dumb, makes DB logic testable/reusable, and is the main thing to imitate when you add features.

Files ending in `-actions.ts` (e.g. `checkout-actions.ts`) are **Server Actions** — functions marked `"use server"` that a form or button can call directly without you writing an API route by hand. Files ending in `-service.ts` are the actual query logic those actions (and pages) call into.

## Supabase setup (`lib/supabase/`)

Three different clients, each for a different context — this is a standard Supabase/Next.js pattern worth understanding well:

- **`client.ts`** — for Client Components (browser). Uses the public anon key.
- **`server.ts`** — for Server Components/Actions. Also anon key, but reads the session from cookies, so RLS-protected queries run "as the logged-in user."
- **`admin.ts`** — uses the **service role key**, which bypasses Row Level Security entirely. Only used in trusted server-only code — the Paystack webhook and enrollment fulfillment. Never importable from anything client-side.
- **`middleware.ts`** (run by `proxy.ts` on every request) — refreshes the session cookie, and is also where route protection happens: redirects to `/login` if you hit `/dashboard` or `/admin` while logged out, and bounces non-admins away from `/admin`.

## Security model — three layers (per the docs, and visible in code)

1. **Middleware** — gatekeeper at the edge, redirects based on auth/role before a page even renders.
2. **Server Action re-checks** — even though middleware blocks the page, every server action re-verifies `auth.getUser()` itself, since middleware alone isn't bulletproof.
3. **Row Level Security (RLS) in Postgres** — the real enforcement layer, defined in `supabase/migrations/*.sql`. E.g. students can only `SELECT` lessons if a `paid` enrollment row exists for that course; instructors can only update their own courses. Worth reading those migration files — they're short and show exactly what each table allows.

## Payments flow (Paystack) — a good thing to study

1. Student clicks checkout → `checkout-service.ts` calls Paystack's `/transaction/initialize` API, embedding `user_id`/`course_id` in metadata, and redirects the browser to Paystack's hosted payment page.
2. Two things can confirm payment, for reliability:
   - The **webhook** (`app/api/webhooks/paystack/route.ts`) — Paystack calls this server-to-server when `charge.success` fires. It verifies the HMAC signature (so randoms can't fake payments), then calls `fulfillPaidEnrollment`.
   - The **callback page** (`dashboard/checkout/callback`) — when the user is redirected back, it calls `verifyAndFulfillPayment` as a backup in case the webhook is slow/down.
3. `enrollment-fulfillment.ts` is idempotent — it checks if an enrollment row already exists before inserting, so duplicate webhook deliveries don't double-enroll someone.

## Database tables (Postgres, via Supabase)

`profiles` (role: student/admin/instructor), `courses`, `lessons`, `enrollments` (the "did they pay" record), `user_progress` (per-lesson completion), `quizzes` + `quiz_attempts`. All access rules for these live in the SQL migrations folder.

## How I'd suggest you get oriented and start contributing