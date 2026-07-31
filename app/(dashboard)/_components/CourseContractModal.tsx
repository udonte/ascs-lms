"use client";

import { useRef, useState, useTransition } from "react";
import { HiOutlineDocumentText, HiOutlineCheckCircle } from "react-icons/hi";
import { agreeToContract } from "@/app/(dashboard)/_actions/contract-actions";

type CourseContractModalProps = {
  courseId: string;
  courseTitle: string;
};

export function CourseContractModal({
  courseId,
  courseTitle,
}: CourseContractModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    // Activate checkbox once within 40px of the bottom
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    if (nearBottom) setHasScrolled(true);
  }

  function handleSubmit() {
    if (!agreed) return;
    setError(null);
    startTransition(async () => {
      try {
        await agreeToContract(courseId);
        // revalidatePath in the action causes the page to re-render
        // without contract modal (needsContractAgreement becomes false)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
    });
  }

  return (
    /* Full-screen overlay — blocks all interaction until agreed */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-customer-charcoal/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contract-modal-title"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 bg-[#003366] px-6 py-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
            <HiOutlineDocumentText className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Before you begin
            </p>
            <h2
              id="contract-modal-title"
              className="text-base font-bold text-white"
            >
              Course Agreement — {courseTitle}
            </h2>
          </div>
        </div>

        {/* Scrollable contract body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-96 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-neutral-700"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Course Agreement
          </p>
          <p className="mb-5 text-sm text-neutral-600">
            This Course Agreement ("Agreement") is entered into as of the date
            of enrollment between{" "}
            <span className="font-semibold text-customer-charcoal">
              ASCS (Tutor)
            </span>{" "}
            and the enrolled{" "}
            <span className="font-semibold text-customer-charcoal">
              Student
            </span>
            . By proceeding, the Student agrees to the following terms.
          </p>

          <Section title="1. Course Details">
            The Tutor agrees to provide the Student with access to the Course,
            which includes:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Comprehensive lessons covering the {courseTitle}</li>
              <li>Downloadable resources and templates</li>
              <li>Access to all course materials on this platform</li>
              <li>
                Support through the course platform for content-related
                inquiries
              </li>
            </ul>
          </Section>

          <Section title="2. Payment Terms">
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                The Student agrees to pay the full course fee before gaining
                access.
              </li>
              <li>All payments are final and non-refundable.</li>
              <li>
                No partial payments or installment plans are available unless
                otherwise specified by the Tutor.
              </li>
            </ul>
          </Section>

          <Section title="3. Access & Course Completion">
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                The Student will receive access to the Course for the duration
                of the course from the date of enrollment.
              </li>
              <li>Access is strictly personal and non-transferable.</li>
              <li>
                The Student is responsible for completing the Course within the
                access period.
              </li>
            </ul>
          </Section>

          <Section title="4. No Guarantee of Results">
            The Tutor makes no guarantees regarding job placement, promotions,
            or salary increases after course completion. The Course provides
            guidance, but success depends on the Student's individual effort,
            application of knowledge, and external factors.
          </Section>

          <Section title="5. Intellectual Property">
            All course content — including videos, documents, and templates —
            remains the exclusive property of the Tutor. The Student may use
            materials for personal learning only.{" "}
            <strong>
              Unauthorized sharing, reproduction, or resale of course materials
              will result in immediate removal from the Course without refund
              and may lead to legal action.
            </strong>
          </Section>

          <Section title="6. Limitation of Liability">
            The Tutor is not liable for any losses, damages, or consequences
            resulting from the Student's use or misapplication of the Course
            materials. The Tutor's liability is strictly limited to the course
            fee paid by the Student.
          </Section>

          <Section title="7. Code of Conduct">
            The Student agrees to engage respectfully in all course discussions
            and activities. Harassment, plagiarism, or unethical behaviour may
            result in immediate removal without refund.
          </Section>

          <Section title="8. Termination of Access">
            The Tutor reserves the right to revoke the Student's access if they
            violate any terms of this Agreement. No refunds will be issued for
            termination due to a violation.
          </Section>

          <Section title="9. Governing Law">
            This Agreement shall be governed by the laws of Nigeria (Lagos
            State). Any disputes shall be resolved through mediation or legal
            proceedings within the jurisdiction of Nigeria/Lagos.
          </Section>

          <Section title="10. Agreement Acceptance">
            By proceeding and checking the box below, the Student acknowledges
            that they have read, understood, and agreed to all terms of this
            Agreement.
          </Section>

          {/* Bottom sentinel — user must reach here */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
            <HiOutlineCheckCircle
              className="h-5 w-5 text-emerald-500"
              aria-hidden
            />
            <p className="text-xs font-semibold text-emerald-700">
              You've reached the end of the agreement.
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        {!hasScrolled && (
          <p className="border-t border-neutral-100 bg-amber-50 px-6 py-2 text-center text-xs text-amber-700">
            Please scroll to the bottom to read the full agreement before
            agreeing.
          </p>
        )}

        {/* Footer actions */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <label
            className={`mb-4 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
              hasScrolled
                ? "border-customer-teal/30 bg-white hover:bg-customer-teal/5"
                : "cursor-not-allowed border-neutral-200 bg-neutral-100 opacity-50"
            }`}
          >
            <input
              type="checkbox"
              disabled={!hasScrolled}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-customer-teal disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-customer-charcoal">
              I have read and agree to the Course Agreement. I understand that
              this agreement is legally binding.
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!agreed || isPending}
            className="w-full rounded-xl bg-[#003366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#003366]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? "Saving your agreement…"
              : "I Agree — Start the Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 font-semibold text-customer-charcoal">{title}</p>
      <div className="text-neutral-600">{children}</div>
    </div>
  );
}
