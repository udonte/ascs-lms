ASCS LMS: Full Technical Implementation Guide (V2.0)

1. Project Mission & Tech Stack
   Objective: A production-grade, automated LMS for the African School of Customer Success (ASCS).
   Core Principle: Automation of enrollment via Paystack, progress tracking, and certification with an extensible architecture for future instructors.

Stack:

Framework: Next.js 15 (App Router, Server Actions)

Database/Auth: Supabase (PostgreSQL, SSR Auth, RLS)

Payments: Paystack (Webhook-driven with Idempotency)

Styling: Tailwind CSS + Shadcn/UI

Infrastructure: Vercel (Hosting)

2. Global Architecture & Route Groups
   Organize the src/app directory to separate concerns and layouts:

(marketing)/: Revamped public site. Uses a "Sales" layout (Big Hero, Navbar, Footer).

(auth)/: Authentication flow (Magic links/OTP).

(dashboard)/: Student learning portal. Uses a "Learning" layout (Sidebar navigation, progress bars).

(admin)/: Content management for Gloria (and future instructors).

api/: Backend-only routes for Paystack webhooks and PDF generation.

3. Database Schema (Extensible Design)
   All tables must include a school_id (default 'ascs') and appropriate owner IDs to support future multi-teacher expansion.

Key Tables:
profiles: id (uuid), full_name, email, role ('student' | 'admin' | 'instructor'), school_id.

courses: id, instructor_id (fk profiles.id), title, description, price, thumbnail_url, is_published.

lessons: id, course_id, title, video_url (YouTube/Vimeo), order_index, content_body.

enrollments: id, user_id, course_id, status ('paid' | 'pending'), paystack_ref (UNIQUE), amount_paid.

user_progress: id, user_id, lesson_id, is_completed (boolean), completed_at.

4. Senior-Level Implementation Rules
   A. The "Service Layer" (Decoupled Queries)
   Rule: No direct Supabase calls inside UI components.

Create src/lib/services/. All database logic must be wrapped in async functions here (e.g., getCourseById, updateLessonProgress).

Benefit: Separation of concerns and easier debugging.

B. Holistic Security Strategy
Layer 1 (Middleware): Use @supabase/ssr to protect the (dashboard) and (admin) routes at the edge.

Layer 2 (Server-Side Validation): Every Server Action must re-verify the user's session and role.

Layer 3 (Row Level Security):

Students can only SELECT lessons if an entry exists in enrollments where status = 'paid'.

Instructors can only UPDATE courses where instructor_id = auth.uid().

C. Idempotent Payment Webhook
Endpoint: /api/paystack-webhook.

Constraint: Must use the Paystack reference as a Unique Key.

Logic:

Verify Paystack Signature.

Check if paystack_ref already exists in the enrollments table.

If it exists, return 200 OK and stop (Prevents double enrollment on network retry).

If new, create enrollment and trigger "Welcome Email."

5. Feature Logic & Automation
   The Learning Engine
   Classroom UI: Persistent sidebar showing lesson list with checkmarks for completion.

State Management: Use Optimistic Updates (useOptimistic hook) when marking lessons complete so the UI feels instant.

Video: Embed logic for YouTube/Vimeo with a custom overlay to prevent easy "Right-click Save-As."

The Certification Engine
Trigger: Calculated only when user_progress for a specific course_id is 100% AND the quiz is passed.

Generation: Use react-pdf to generate a branded certificate on the server side.

6. Development Milestones
   Foundation: Setup Next.js 15, Supabase SSR, and middleware.ts.

Marketing Revamp: Migrate existing React code into (marketing) with the brand colors (#003366, #FFCC00).

Auth Flow: Magic link login and profile creation logic.

LMS Core: Database service layer, course listing, and the video classroom.

Payment Integration: Paystack checkout and the idempotent webhook.

Progress & Quizzes: Progress tracking logic and the assessment engine.

Handoff: Final SEO audit, Vercel deployment, and domain connection.

7. Instructions for Claude (AI Pair Programmer)
   Consistency: Always check agent.md and IMPLEMENTATION_GUIDE.md before generating code.

Performance: Use Next.js Server Components for data fetching. Use Client Components only for interactivity.

Resilience: Always include loading skeletons (loading.tsx) and error boundaries.

Future-Proofing: Write queries that filter by instructor_id even if only one admin exists today.
