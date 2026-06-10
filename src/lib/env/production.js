/**
 * Production environment helpers — single source of truth for Vercel / live deploys.
 */

const YVITY_DEV_SUPABASE_REF = "akwvvhntxbhjyixaxhpv";

export function getSupabaseUrl() {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
}

export function getSupabaseAnonKey() {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
}

export function getSupabaseServiceRoleKey() {
  return (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey() && getSupabaseServiceRoleKey());
}

export function getAdminPublicBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).trim();
}

export function getGoldAppBaseUrl() {
  return (
    process.env.YVITY_GOLD_BASE_URL ||
    process.env.NEXT_PUBLIC_YVITY_GOLD_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).trim();
}

export function isAwsS3Configured() {
  return Boolean(
    process.env.AWS_REGION?.trim() &&
      process.env.AWS_ACCESS_KEY_ID?.trim() &&
      process.env.AWS_SECRET_ACCESS_KEY?.trim() &&
      process.env.AWS_S3_BUCKET_NAME?.trim(),
  );
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function isDevAuthDisabled() {
  return process.env.YVITY_ADMIN_DEV_AUTH === "false";
}

/** Env vars listed on Vercel but not read by Yvity_Admin application code. */
export const ADMIN_UNUSED_ENV_KEYS = [
  "JWT_SECRET_KEY",
  "CODE_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RAZORPAY_WEBHOOK_SECRET",
  "WHATSAPP_BUSINESS_NUMBER",
];

export function getProductionEnvReport() {
  const supabaseUrl = getSupabaseUrl();
  const checks = [
    {
      id: "supabase_url",
      label: "NEXT_PUBLIC_SUPABASE_URL",
      required: true,
      ok: Boolean(supabaseUrl),
      hint: "Yvity_Dev: https://akwvvhntxbhjyixaxhpv.supabase.co",
    },
    {
      id: "supabase_anon",
      label: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      required: true,
      ok: Boolean(getSupabaseAnonKey()),
    },
    {
      id: "supabase_service",
      label: "SUPABASE_SERVICE_ROLE_KEY",
      required: true,
      ok: Boolean(getSupabaseServiceRoleKey()),
    },
    {
      id: "admin_base_url",
      label: "NEXT_PUBLIC_BASE_URL",
      required: true,
      ok: Boolean(getAdminPublicBaseUrl()),
      hint: "Public Admin URL, e.g. https://admin.yvity.in",
    },
    {
      id: "gold_base_url",
      label: "YVITY_GOLD_BASE_URL",
      required: true,
      ok: Boolean(getGoldAppBaseUrl()),
      hint: "Users app URL for referral/payment links",
    },
    {
      id: "whatsapp_url",
      label: "WHATSAPP_API_URL or WHATSAPP_PHONE_NUMBER_ID",
      required: true,
      ok: Boolean(
        process.env.WHATSAPP_API_URL?.trim() ||
          process.env.WHATSAPP_PHONE_NUMBER_ID?.trim(),
      ),
    },
    {
      id: "whatsapp_token",
      label: "WHATSAPP_ACCESS_TOKEN (or WHATSAPP_API_TOKEN)",
      required: true,
      ok: Boolean(
        process.env.WHATSAPP_ACCESS_TOKEN?.trim() ||
          process.env.WHATSAPP_API_TOKEN?.trim(),
      ),
    },
    {
      id: "dev_auth_off",
      label: "YVITY_ADMIN_DEV_AUTH=false",
      required: isProductionRuntime(),
      ok: !isProductionRuntime() || isDevAuthDisabled(),
      hint: "Required on Vercel production",
    },
    {
      id: "aws_region",
      label: "AWS_REGION",
      required: false,
      ok: Boolean(process.env.AWS_REGION?.trim()),
      hint: "Required for S3 uploads (testimonials, media)",
    },
    {
      id: "aws_s3",
      label: "AWS S3 credentials + bucket",
      required: false,
      ok: isAwsS3Configured(),
      hint: "AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME",
    },
    {
      id: "yvity_dev_ref",
      label: "Supabase project is Yvity_Dev",
      required: false,
      ok: supabaseUrl.includes(YVITY_DEV_SUPABASE_REF),
      hint: `Expected ref ${YVITY_DEV_SUPABASE_REF} for current staging setup`,
    },
  ];

  const failedRequired = checks.filter((item) => item.required && !item.ok);
  const warnings = checks.filter((item) => !item.required && !item.ok);

  return {
    ok: failedRequired.length === 0,
    checks,
    failedRequired,
    warnings,
    unusedOnAdmin: ADMIN_UNUSED_ENV_KEYS,
  };
}
