-- ============================================================
-- ASCS LMS — Complete Database Schema
-- Generated from all migrations and manual SQL runs
-- Run this in a fresh Supabase project SQL Editor to recreate
-- the full database. Execute in order — do not reorder blocks.
-- ============================================================


-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE,
  role text DEFAULT 'student' CHECK (role = ANY (ARRAY['student','admin','instructor'])),
  school_id text DEFAULT 'ascs',
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  thumbnail_url text,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  slug text UNIQUE,
  short_title text,
  prerequisite_course_id uuid REFERENCES public.courses(id),
  lemonsqueezy_variant_id text,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);

CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  course_id uuid REFERENCES public.courses(id),
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending','paid'])),
  amount_paid numeric,
  created_at timestamp with time zone DEFAULT now(),
  paystack_ref text,
  completed_at timestamp with time zone,
  payment_gateway text CHECK (payment_gateway = ANY (ARRAY['paystack','lemonsqueezy','manual','free'])),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id)
);

CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text,
  order_index integer,
  content_body text,
  CONSTRAINT lessons_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  lesson_id uuid REFERENCES public.lessons(id),
  is_completed boolean DEFAULT false,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_progress_user_lesson_unique UNIQUE (user_id, lesson_id)
);

CREATE TABLE public.quizzes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  course_id uuid UNIQUE REFERENCES public.courses(id),
  title text NOT NULL,
  passing_score integer DEFAULT 70,
  questions jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT quizzes_pkey PRIMARY KEY (id)
);

CREATE TABLE public.quiz_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  course_id uuid REFERENCES public.courses(id),
  score integer NOT NULL,
  passed boolean NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT quiz_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_attempts_user_course_unique UNIQUE (user_id, course_id)
);

CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_number text NOT NULL UNIQUE,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT certificates_pkey PRIMARY KEY (id),
  CONSTRAINT certificates_user_course_unique UNIQUE (user_id, course_id)
);

CREATE TABLE public.certificate_sequences (
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  next_number integer NOT NULL DEFAULT 1,
  CONSTRAINT certificate_sequences_pkey PRIMARY KEY (course_id)
);

CREATE TABLE public.lemonsqueezy_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id text NOT NULL UNIQUE,
  user_id uuid REFERENCES public.profiles(id),
  course_id uuid REFERENCES public.courses(id),
  amount_total numeric,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending','paid','refunded','failed'])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lemonsqueezy_orders_pkey PRIMARY KEY (id)
);


-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lemonsqueezy_orders ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- HELPER FUNCTIONS
-- (used in RLS policies below)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'instructor')
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_course(p_course_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (
      role = 'admin'
      OR (role = 'instructor' AND EXISTS (
        SELECT 1 FROM public.courses
        WHERE id = p_course_id AND instructor_id = auth.uid()
      ))
    )
  );
$$;


-- ============================================================
-- RLS POLICIES — PROFILES
-- ============================================================

CREATE POLICY "profiles_student_select_own"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "profiles_student_update_own"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_student_insert_own"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_staff_select"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_staff());


-- ============================================================
-- RLS POLICIES — COURSES
-- ============================================================

-- Anon and authenticated can browse published courses
CREATE POLICY "courses_anon_select_published"
ON public.courses FOR SELECT
USING (is_published = true);

-- Staff can see all courses including drafts
CREATE POLICY "courses_staff_select_all"
ON public.courses FOR SELECT TO authenticated
USING (public.is_staff());

-- Staff can insert courses
CREATE POLICY "courses_staff_insert"
ON public.courses FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

-- Staff can update their own courses (admin can update any)
CREATE POLICY "courses_staff_update"
ON public.courses FOR UPDATE TO authenticated
USING (public.can_manage_course(id));

-- Only admins can delete courses
CREATE POLICY "courses_admin_delete"
ON public.courses FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);


-- ============================================================
-- RLS POLICIES — ENROLLMENTS
-- ============================================================

-- Students can see their own enrollments
CREATE POLICY "enrollments_student_select_own"
ON public.enrollments FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Students can insert their own enrollments (free enrollment)
CREATE POLICY "enrollments_student_insert_own"
ON public.enrollments FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Students can update their own enrollments
CREATE POLICY "enrollments_student_update_own"
ON public.enrollments FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Staff can read all enrollments
CREATE POLICY "enrollments_staff_select_all"
ON public.enrollments FOR SELECT TO authenticated
USING (public.is_staff());

-- Staff can insert enrollments (manual access grants)
CREATE POLICY "enrollments_staff_insert"
ON public.enrollments FOR INSERT TO authenticated
WITH CHECK (public.is_staff());


-- ============================================================
-- RLS POLICIES — LESSONS
-- ============================================================

-- Enrolled students can read lessons for their paid courses
CREATE POLICY "lessons_enrolled_student_select"
ON public.lessons FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND course_id = lessons.course_id
    AND status = 'paid'
  )
);

-- Staff can manage all lessons
CREATE POLICY "lessons_staff_select"
ON public.lessons FOR SELECT TO authenticated
USING (public.is_staff());

CREATE POLICY "lessons_staff_insert"
ON public.lessons FOR INSERT TO authenticated
WITH CHECK (public.can_manage_course(course_id));

CREATE POLICY "lessons_staff_update"
ON public.lessons FOR UPDATE TO authenticated
USING (public.can_manage_course(course_id));

CREATE POLICY "lessons_staff_delete"
ON public.lessons FOR DELETE TO authenticated
USING (public.can_manage_course(course_id));


-- ============================================================
-- RLS POLICIES — USER PROGRESS
-- ============================================================

CREATE POLICY "user_progress_student_all"
ON public.user_progress FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


-- ============================================================
-- RLS POLICIES — QUIZZES
-- ============================================================

-- Enrolled students can read quizzes for their paid courses
CREATE POLICY "quizzes_enrolled_student_select"
ON public.quizzes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid()
    AND course_id = quizzes.course_id
    AND status = 'paid'
  )
);

-- Staff can manage quizzes
CREATE POLICY "quizzes_staff_select"
ON public.quizzes FOR SELECT TO authenticated
USING (public.is_staff());

CREATE POLICY "quizzes_staff_insert"
ON public.quizzes FOR INSERT TO authenticated
WITH CHECK (public.can_manage_course(course_id));

CREATE POLICY "quizzes_staff_update"
ON public.quizzes FOR UPDATE TO authenticated
USING (public.can_manage_course(course_id));

CREATE POLICY "quizzes_staff_delete"
ON public.quizzes FOR DELETE TO authenticated
USING (public.can_manage_course(course_id));


-- ============================================================
-- RLS POLICIES — QUIZ ATTEMPTS
-- ============================================================

CREATE POLICY "quiz_attempts_student_all"
ON public.quiz_attempts FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "quiz_attempts_staff_select"
ON public.quiz_attempts FOR SELECT TO authenticated
USING (public.is_staff());


-- ============================================================
-- RLS POLICIES — CERTIFICATES
-- ============================================================

-- Public can verify any certificate by number (for /verify page)
CREATE POLICY "certificates_public_verify"
ON public.certificates FOR SELECT
USING (true);

-- Students can read their own certificates
CREATE POLICY "certificates_student_select_own"
ON public.certificates FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Staff can read all certificates
CREATE POLICY "certificates_staff_select_all"
ON public.certificates FOR SELECT TO authenticated
USING (public.is_staff());


-- ============================================================
-- RLS POLICIES — CERTIFICATE SEQUENCES
-- (service role only — no direct student/staff access needed)
-- ============================================================

-- No policies needed — accessed only via SECURITY DEFINER function below


-- ============================================================
-- RLS POLICIES — LEMONSQUEEZY ORDERS
-- ============================================================

CREATE POLICY "lemonsqueezy_orders_staff_select"
ON public.lemonsqueezy_orders FOR SELECT TO authenticated
USING (public.is_staff());


-- ============================================================
-- POSTGRES FUNCTION — generate_certificate
-- Atomically generates and issues a certificate number.
-- Called via supabase.rpc() from certificate-generation-service.ts
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_certificate(
  p_user_id  uuid,
  p_course_id uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_short_title  text;
  v_next_number  integer;
  v_cert_number  text;
  v_existing     text;
BEGIN
  -- 1. Idempotent: return existing certificate if already issued
  SELECT certificate_number INTO v_existing
  FROM public.certificates
  WHERE user_id = p_user_id AND course_id = p_course_id;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- 2. Get course short_title for the number prefix (e.g. "STC", "FCSM")
  SELECT COALESCE(UPPER(TRIM(short_title)), 'ASCS') INTO v_short_title
  FROM public.courses
  WHERE id = p_course_id;

  -- 3. Atomically claim the next sequence number (FOR UPDATE prevents races)
  SELECT next_number INTO v_next_number
  FROM public.certificate_sequences
  WHERE course_id = p_course_id
  FOR UPDATE;

  IF v_next_number IS NULL THEN
    v_next_number := 1;
    INSERT INTO public.certificate_sequences (course_id, next_number)
    VALUES (p_course_id, 2)
    ON CONFLICT (course_id) DO NOTHING;
  ELSE
    UPDATE public.certificate_sequences
    SET next_number = next_number + 1
    WHERE course_id = p_course_id;
  END IF;

  -- 4. Format: ASCS-{INITIALS}-{0001}
  v_cert_number := 'ASCS-' || v_short_title || '-' || LPAD(v_next_number::text, 4, '0');

  -- 5. Issue the certificate record
  INSERT INTO public.certificates (user_id, course_id, certificate_number, issued_at)
  VALUES (p_user_id, p_course_id, v_cert_number, NOW());

  RETURN v_cert_number;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_certificate(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_certificate(uuid, uuid) TO service_role;


-- ============================================================
-- STORAGE — course-thumbnails bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "course_thumbnails_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "course_thumbnails_staff_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'course-thumbnails'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

CREATE POLICY "course_thumbnails_staff_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'course-thumbnails'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);

CREATE POLICY "course_thumbnails_staff_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'course-thumbnails'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  )
);


-- ============================================================
-- TRIGGER — auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();