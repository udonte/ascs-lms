-- Allow enrolled students to read quizzes for their paid courses
-- This is required for rendering the Final Assessment in the classroom.

DROP POLICY IF EXISTS "quizzes_student_select_paid_course" ON public.quizzes;

CREATE POLICY "quizzes_student_select_paid_course"
ON public.quizzes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.enrollments e
    WHERE e.course_id = quizzes.course_id
      AND e.user_id = auth.uid()
      AND e.status = 'paid'
  )
);

