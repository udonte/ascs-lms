-- Ensure enrollments table supports payment fulfillment

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS amount_paid numeric DEFAULT 0;

-- Optional payment reference (Paystack transaction id)
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS reference text;

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS paystack_ref text;

-- One paid enrollment per student per course (required for idempotent fulfillment)
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_user_id_course_id_key
  ON public.enrollments (user_id, course_id);

-- Students may read lessons for courses they have paid access to
DROP POLICY IF EXISTS "lessons_enrolled_student_select" ON public.lessons;

CREATE POLICY "lessons_enrolled_student_select"
ON public.lessons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.enrollments e
    WHERE e.course_id = lessons.course_id
      AND e.user_id = auth.uid()
      AND e.status = 'paid'
  )
);
