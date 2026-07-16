"use server";

import {
  verifyCertificate,
  type CertificateVerifyResult,
} from "./certificate-verify-service";

export type VerifyActionState = {
  result?: CertificateVerifyResult;
  error?: string;
};

export async function verifyCertificateAction(
  _prevState: VerifyActionState,
  formData: FormData,
): Promise<VerifyActionState> {
  const number = String(formData.get("certificateNumber") ?? "").trim();

  if (!number) {
    return { error: "Please enter a certificate number." };
  }

  try {
    const result = await verifyCertificate(number);
    return { result };
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.",
    };
  }
}
