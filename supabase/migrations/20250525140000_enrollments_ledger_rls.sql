-- ASCS LMS: RLS for admin student ledger (read enrollments, grant manual access)
-- Requires public.is_staff() from courses_rls migration.

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enrollments_staff_select" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_staff_insert" ON public.enrollments;

CREATE POLICY "enrollments_staff_select"
ON public.enrollments
FOR SELECT
TO authenticated
USING (public.is_staff());

CREATE POLICY "enrollments_staff_insert"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (public.is_staff());

-- Staff can look up student profiles by email when granting access
DROP POLICY IF EXISTS "profiles_staff_select" ON public.profiles;

CREATE POLICY "profiles_staff_select"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_staff());
