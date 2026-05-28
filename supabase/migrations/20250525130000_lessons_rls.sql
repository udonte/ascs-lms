-- ASCS LMS: Row Level Security for lessons (course editor)
-- Run in Supabase Dashboard → SQL Editor after courses_rls migration.

CREATE OR REPLACE FUNCTION public.can_manage_course(p_course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.courses c
    INNER JOIN public.profiles p ON p.id = auth.uid()
    WHERE c.id = p_course_id
      AND (
        p.role = 'admin'
        OR (p.role = 'instructor' AND c.instructor_id = auth.uid())
      )
  );
$$;

-- Master admin may update any course (in addition to staff_update_own)
DROP POLICY IF EXISTS "courses_admin_update_all" ON public.courses;
CREATE POLICY "courses_admin_update_all"
ON public.courses
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons_staff_select" ON public.lessons;
DROP POLICY IF EXISTS "lessons_staff_insert" ON public.lessons;
DROP POLICY IF EXISTS "lessons_staff_update" ON public.lessons;
DROP POLICY IF EXISTS "lessons_staff_delete" ON public.lessons;

CREATE POLICY "lessons_staff_select"
ON public.lessons
FOR SELECT
TO authenticated
USING (public.can_manage_course(course_id));

CREATE POLICY "lessons_staff_insert"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_course(course_id));

CREATE POLICY "lessons_staff_update"
ON public.lessons
FOR UPDATE
TO authenticated
USING (public.can_manage_course(course_id))
WITH CHECK (public.can_manage_course(course_id));

CREATE POLICY "lessons_staff_delete"
ON public.lessons
FOR DELETE
TO authenticated
USING (public.can_manage_course(course_id));
