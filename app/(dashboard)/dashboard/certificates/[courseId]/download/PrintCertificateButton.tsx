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

// Minimum landscape width — forces the certificate to render horizontally
// on any screen size, including narrow mobile viewports.
const CERT_WIDTH = 1123;

async function exportCertificateImage(element: HTMLElement) {
  const filenameBase = `ascs-certificate-${new Date().toISOString().slice(0, 10)}`;

  // Snapshot current inline styles so we can restore them after capture.
  const prev = {
    width: element.style.width,
    height: element.style.height,
    minWidth: element.style.minWidth,
    overflow: element.style.overflow,
  };

  // Force landscape width and let height be natural (no hard-coded height).
  // After the browser reflows at CERT_WIDTH, scrollHeight gives us the exact
  // content height — so the exported image has zero blank space at the bottom.
  element.style.width = `${CERT_WIDTH}px`;
  element.style.minWidth = `${CERT_WIDTH}px`;
  element.style.height = "auto";
  element.style.overflow = "visible";

  // Allow one animation frame for the browser to reflow at the new width.
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  const captureHeight = element.scrollHeight;

  const captureOpts = {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    width: CERT_WIDTH,
    height: captureHeight,
  };

  try {
    // Prefer PNG (best quality). Some browsers/devices may be memory constrained,
    // so we fall back to JPEG if needed.
    try {
      const dataUrl = await toPng(element, captureOpts);
      downloadDataUrl(dataUrl, `${filenameBase}.png`);
    } catch {
      const dataUrl = await toJpeg(element, {
        ...captureOpts,
        quality: 0.95,
      });
      downloadDataUrl(dataUrl, `${filenameBase}.jpeg`);
    }
  } finally {
    // Always restore original styles so the page layout is unaffected.
    element.style.width = prev.width;
    element.style.height = prev.height;
    element.style.minWidth = prev.minWidth;
    element.style.overflow = prev.overflow;
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

