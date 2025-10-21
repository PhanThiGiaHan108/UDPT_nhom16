import crypto from "crypto";

/**
 * payOS signature verification
 * Docs (typical): HMAC-SHA256 over raw request body string using Checksum Key
 */
export function verifyPayOSSignature(rawBody, signature) {
  try {
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY || "";
    if (!checksumKey) return false;

    // rawBody must be the exact raw JSON string as received
    const hmac = crypto.createHmac("sha256", checksumKey);
    const digest = hmac.update(rawBody).digest("hex");
    return digest === signature;
  } catch (e) {
    console.error("verifyPayOSSignature error:", e);
    return false;
  }
}

/**
 * Extract TXN code (transactionId) from a description string
 * Expected format contains token like "TXNxxxxxxxx"
 */
export function extractTxnIdFromDescription(description = "") {
  const m = description.match(/TXN[A-Z0-9]+/i);
  return m ? m[0] : null;
}

/**
 * Extract userId and courseId from description "<userId>_<courseId>"
 */
export function extractUserCourseFromDescription(description = "") {
  const parts = (description || "").split("_");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { userId: parts[0], courseId: parts[1] };
  }
  return null;
}
