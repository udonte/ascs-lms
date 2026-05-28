-- ASCS LMS: RLS for quiz builder (requires can_manage_course from lessons migration)

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quizzes_staff_select" ON public.quizzes;
DROP POLICY IF EXISTS "quizzes_staff_insert" ON public.quizzes;
DROP POLICY IF EXISTS "quizzes_staff_update" ON public.quizzes;

CREATE POLICY "quizzes_staff_select"
ON public.quizzes
FOR SELECT
TO authenticated
USING (public.can_manage_course(course_id));

CREATE POLICY "quizzes_staff_insert"
ON public.quizzes
FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_course(course_id));

CREATE POLICY "quizzes_staff_update"
ON public.quizzes
FOR UPDATE
TO authenticated
USING (public.can_manage_course(course_id))
WITH CHECK (public.can_manage_course(course_id));
