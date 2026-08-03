"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineSearch, HiOutlineBadgeCheck } from "react-icons/hi";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [certId, setCertId] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = certId.trim();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed.toUpperCase())}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      {/* Header */}
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          <span className="text-lg font-black tracking-tight text-customer-teal">
            ASCS
          </span>
        </Link>

        <div className="mt-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-customer-teal/10">
            <HiOutlineBadgeCheck className="h-8 w-8 text-customer-teal" />
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-customer-charcoal">
          Certificate Verification
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Enter a certificate ID to verify an ASCS credential
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
      >
        <div className="px-6 py-8">
          <label
            htmlFor="cert-id"
            className="mb-2 block text-sm font-semibold text-customer-charcoal"
          >
            Certificate ID
          </label>
          <input
            id="cert-id"
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="e.g. ASCS-2025-00123"
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-base font-mono tracking-wider text-customer-charcoal placeholder-neutral-400 outline-none transition focus:border-customer-teal focus:ring-2 focus:ring-customer-teal/20 sm:text-sm"
          />
          <p className="mt-2 text-xs text-neutral-400">
            The certificate ID is printed on the credential, usually in the
            format ASCS-YYYY-XXXXX.
          </p>
        </div>

        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4">
          <button
            type="submit"
            disabled={!certId.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#003366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003366]/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiOutlineSearch className="h-4 w-4" />
            Verify Certificate
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-xs text-neutral-400">
        <Link href="/" className="underline hover:text-customer-teal">
          Back to home
        </Link>
      </p>
    </div>
  );
}
