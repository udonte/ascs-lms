# Project: ASCS Digital Learning Management System (LMS)

## 1. Project Context & Branding

- **Client:** African School of Customer Success (ASCS)
- **Brand Identity:**
  - **Primary Blue:** `#003366` (Main Branding, Navbars, Headers)
  - **Secondary Gold:** `#FFCC00` (Primary Buttons, CTAs)
  - **Background:** `#F9FAFB` (Clean, minimalist learning environment)
  - **Font:** Inter or Plus Jakarta Sans

## 2. Technical Stack

- **Framework:** Next.js 15 (App Router)
- **Auth & Database:** Supabase SSR (Auth, PostgreSQL, Storage)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Payments:** Paystack SDK + Webhooks
- **Infrastructure:** Vercel (Hosting)

## 3. Project Architecture (Unified App)

- The marketing website and LMS live in a single repository using Route Groups:

```text
app/
 ├── (marketing)/    # Revamped Public Site (Next.js version of the original)
 ├── (auth)/         # Login, Signup, Password Reset
 ├── (dashboard)/    # Student LMS Portal (Protected)
 ├── (admin)/        # ASCS Internal Admin (Protected)
 └── api/            # Paystack Webhooks & Certificate PDF generation
```

## 4. Database Schema (Supabase)

```text
profiles: id (uuid), full_name (text), role (text)

courses: id (uuid), title (text), description (text), price (numeric), thumbnail_url (text)

lessons: id (uuid), course_id (uuid), title (text), video_url (text), order_index (int)

enrollments: id (uuid), user_id (uuid), course_id (uuid), status (text), reference (text)

quizzes: id (uuid), course_id (uuid), passing_score (int), questions (jsonb)

user_progress: id (uuid), user_id (uuid), lesson_id (uuid), is_completed (bool)
```

## 5. Implementation Rules & Constraints

- **Server Components:** Use Server Components by default for SEO and performance.
- **Client Components:** Use strictly for interactive elements (Paystack buttons, Quiz forms).
- **Middleware:** Implement middleware.ts using @supabase/ssr to protect /dashboard and /admin.
- **LMS Logic:**
  - Courses unlock automatically ONLY when Paystack webhook returns charge.success.
  - Certificates are only generated if user_progress for a course is 100% and quiz score >= passing_score.
- **Maintenance:** Include a "Keep-Alive" cron job script to prevent Supabase Free Tier hibernation.

## 6. Business Boundaries (Standard Lite)

- **Single Admin:** No multi-instructor logic; all content managed by ASCS master admin.
- **Content:** Developer handles initial technical setup/template for 2 courses only.
