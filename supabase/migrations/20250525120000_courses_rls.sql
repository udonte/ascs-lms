-- ASCS LMS: Row Level Security for courses (admin / instructor content management)
-- Run in Supabase Dashboard → SQL Editor if you are not using the Supabase CLI.

-- Helper: true when the signed-in user is admin or instructor
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'instructor')
  );
$$;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Idempotent re-run
DROP POLICY IF EXISTS "courses_public_select_published" ON public.courses;
DROP POLICY IF EXISTS "courses_staff_select_own" ON public.courses;
DROP POLICY IF EXISTS "courses_admin_select_all" ON public.courses;
DROP POLICY IF EXISTS "courses_staff_insert_own" ON public.courses;
DROP POLICY IF EXISTS "courses_staff_update_own" ON public.courses;

-- Students & visitors (authenticated): published catalog only
CREATE POLICY "courses_public_select_published"
ON public.courses
FOR SELECT
TO authenticated
USING (is_published = true);

-- Instructors: own courses including drafts
CREATE POLICY "courses_staff_select_own"
ON public.courses
FOR SELECT
TO authenticated
USING (public.is_staff() AND instructor_id = auth.uid());

-- Master admin: all courses
CREATE POLICY "courses_admin_select_all"
ON public.courses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- Instructors & admins: create draft courses they own
CREATE POLICY "courses_staff_insert_own"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (public.is_staff() AND instructor_id = auth.uid());

-- Instructors & admins: update own courses
CREATE POLICY "courses_staff_update_own"
ON public.courses
FOR UPDATE
TO authenticated
USING (public.is_staff() AND instructor_id = auth.uid())
WITH CHECK (public.is_staff() AND instructor_id = auth.uid());
