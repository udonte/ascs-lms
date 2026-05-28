# Supabase migrations

## Fix: "new row violates row-level security policy for table courses"

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Paste and run the contents of `migrations/20250525120000_courses_rls.sql`.
3. Confirm your user has `profiles.role` set to `admin` or `instructor` (Table Editor → `profiles`).
4. Retry **Create Course** in the admin Content Manager.

## Lessons editor (course drill-down)

After courses work, also run `migrations/20250525130000_lessons_rls.sql` so admins can add and reorder lessons on `/admin/courses/[id]`.

## Student ledger (`/admin/students`)

Run `migrations/20250525140000_enrollments_ledger_rls.sql` so staff can read enrollments, look up profiles by email, and grant manual access.

## Quiz builder (`/admin/quizzes`)

Run `migrations/20250525150000_quizzes_rls.sql` so staff can create and update quizzes for courses they manage.

## Student checkout & webhooks

1. Run `migrations/20250525160000_enrollments_student_rls.sql` so students can read their enrollments.
2. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (Supabase → Project Settings → API) so Paystack webhooks and payment verification can write enrollments.
3. Set `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` for checkout redirects.
4. Run `migrations/20250525170000_enrollments_fulfillment.sql` for `amount_paid`, unique `(user_id, course_id)`, and lesson read access for enrolled students.
5. Run `migrations/20250525180000_user_progress_rls.sql` so students can save lesson completions in the classroom.

## CLI (optional)

```bash
npx supabase db push
```

Requires the Supabase CLI linked to your project.
