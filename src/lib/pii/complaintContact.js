import { createAdminClient } from "@/lib/supabase/server";
import { maskEmailDomain, maskPhoneLast4 } from "@/lib/pii/constants";

export function maskComplaintReporter(complaint = {}) {
  const last4 = complaint.reporter_phone_last4 || complaint.reporter_phone_plain?.slice(-4);
  return {
    name: complaint.reporter_name || "Anonymous reporter",
    phone: maskPhoneLast4(last4),
    email: complaint.reporter_email_domain
      ? maskEmailDomain(complaint.reporter_email_domain)
      : "•••@•••",
  };
}

/**
 * Reveal reporter contact for privileged admins. Local dev may store plaintext fields.
 * Production expects encrypted columns + PII_ENCRYPTION_KEY (wire when key is configured).
 */
export async function revealComplaintContact(complaint = {}) {
  if (complaint.reporter_phone_plain) {
    return {
      phone: complaint.reporter_phone_plain,
      email: complaint.reporter_email_plain || null,
      source: "local",
    };
  }

  // Encrypted-at-rest fields decrypt here once @/lib/pii/crypto is wired with PII_ENCRYPTION_KEY.

  const masked = maskComplaintReporter(complaint);
  return {
    phone: masked.phone,
    email: masked.email,
    source: "masked",
    message: "Full contact unavailable — encryption key not configured.",
  };
}

export async function logComplaintPiiAccess({
  adminId,
  complaintId,
  metadata = {},
  req,
}) {
  try {
    const supabase = createAdminClient();
    const headers = req?.headers;
    await supabase.from("pii_access_audit_log").insert({
      admin_id: adminId,
      action: "view_complaint_contact",
      entity_type: "platform_complaint",
      entity_id: complaintId,
      complaint_id: complaintId,
      metadata,
      ip_address: headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      user_agent: headers?.get("user-agent") || null,
    });
  } catch (error) {
    console.warn("PII audit log failed:", error?.message || error);
  }
}
