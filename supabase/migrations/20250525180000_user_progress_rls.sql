-- Student lesson progress (classroom completions)

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_progress_student_select_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_student_insert_own" ON public.user_progress;
DROP POLICY IF EXISTS "user_progress_student_update_own" ON public.user_progress;

CREATE POLICY "user_progress_student_select_own"
ON public.user_progress
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user_progress_student_insert_own"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_progress_student_update_own"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS user_progress_user_id_lesson_id_key
  ON public.user_progress (user_id, lesson_id);
