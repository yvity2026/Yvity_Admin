import crypto from "crypto";

const SECRET = process.env.CODE_SECRET || "dfgfhgjmhgnmghmnghg28984265fgetgteogbUYGNUYG76n6nt76t7t76T76tb67f6TFBG6";

export async function verifyCode(code) {
  try {
    if (!SECRET) throw new Error("CODE_SECRET missing");

    const decodedUrl = decodeURIComponent(code);

    const normalized = decodedUrl
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      normalized.length + (4 - (normalized.length % 4)) % 4,
      "="
    );

    const decoded = Buffer.from(padded, "base64").toString("utf-8");

    const parts = decoded.split(".");
    if (parts.length !== 3) return null;

    const [userId, timestamp, signature] = parts;

    const payload = `${userId}.${timestamp}`;

    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      return null;
    }

    const age = Date.now() - Number(timestamp);

    if (age > 10 * 60 * 1000) { // 10 min
      return null;
    }

    return {
      userId,
      timestamp: Number(timestamp),
    };
  } catch (e) {
    console.error("verifyCode failed:", e);
    return null;
  }
}