"use client";

import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toJpeg, toPng } from "html-to-image";

type PrintCertificateButtonProps = {
  className?: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function exportCertificateImage(element: HTMLElement) {
  const filenameBase = `ascs-certificate-${new Date().toISOString().slice(0, 10)}`;

  // Prefer PNG (best quality). Some browsers/devices may be memory constrained,
  // so we fall back to JPEG if needed.
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
    downloadDataUrl(dataUrl, `${filenameBase}.png`);
    return;
  } catch {
    const dataUrl = await toJpeg(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      quality: 0.95,
    });
    downloadDataUrl(dataUrl, `${filenameBase}.jpeg`);
  }
}

export function PrintCertificateButton({
  className,
}: PrintCertificateButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    const certificate = document.getElementById("certificate");
    if (!certificate) return;

    setDownloading(true);
    try {
      await exportCertificateImage(certificate);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-xl bg-customer-teal px-5 py-2.5 text-sm font-semibold text-customer-cream shadow-sm transition hover:bg-customer-teal/90 disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      <FiDownload className="h-4 w-4" aria-hidden />
      {downloading ? "Preparing download…" : "Download Certificate Image"}
    </button>
  );
}

