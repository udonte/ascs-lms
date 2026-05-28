-- Students: read and create their own enrollments (free checkout + dashboard)

DROP POLICY IF EXISTS "enrollments_student_select_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_student_insert_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_student_update_own" ON public.enrollments;

CREATE POLICY "enrollments_student_select_own"
ON public.enrollments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "enrollments_student_insert_own"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_student_update_own"
ON public.enrollments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
