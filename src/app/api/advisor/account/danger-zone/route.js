import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ACTIONS = {
  deactivate: {
    purpose: "deactivate_account",
    subject: "Confirm Yvity account deactivation",
    label: "deactivate your Yvity account",
    heading: "Confirm account deactivation",
  },
  delete: {
    purpose: "delete_account",
    subject: "Confirm Yvity account deletion",
    label: "delete your Yvity account",
    heading: "Confirm account deletion",
  },
};

function json(message, status, extra = {}) {
  return NextResponse.json({ success: status < 400, message, ...extra }, { status });
}

function clearAuthCookies(response) {
  ["session", "yvity_user_id"].forEach((name) => {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  });

  return response;
}

function getFallbackRedirectUrl() {
  if (process.env.NODE_ENV === "development") {
    return process.env.DASHBOARD_LOCAL_FALLBACK || "http://localhost:3000";
  }

  return process.env.DASHBOARD_PRODUCTION_FALLBACK || "https://yvity.vercel.app";
}

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function renderOtpEmail({ otp, actionLabel, heading }) {
  return `
    <style>
      @media only screen and (min-width: 640px) {
        .email-shell {
          padding: 24px !important;
        }

        .email-header,
        .email-body {
          padding: 28px 26px !important;
        }

        .email-title {
          font-size: 26px !important;
        }

        .email-copy {
          font-size: 15px !important;
        }

        .email-code {
          font-size: 30px !important;
          letter-spacing: 7px !important;
        }

        .email-warning {
          font-size: 13px !important;
        }
      }

      @media only screen and (min-width: 768px) {
        .email-shell {
          padding: 32px !important;
        }

        .email-header,
        .email-body {
          padding: 32px !important;
        }

        .email-title {
          font-size: 28px !important;
        }

        .email-copy {
          font-size: 16px !important;
        }

        .email-code {
          font-size: 32px !important;
          letter-spacing: 8px !important;
        }

        .email-warning {
          font-size: 14px !important;
        }
      }

      @media only screen and (min-width: 1024px) {
        .email-shell {
          padding: 40px !important;
        }

        .email-card {
          max-width: 600px !important;
        }

        .email-header,
        .email-body {
          padding: 32px !important;
        }

        .email-title {
          font-size: 30px !important;
        }

        .email-code {
          font-size: 34px !important;
          letter-spacing: 9px !important;
        }
      }

      @media only screen and (min-width: 1280px) {
        .email-shell {
          padding: 48px !important;
        }

        .email-card {
          max-width: 620px !important;
        }

        .email-title {
          font-size: 31px !important;
        }

        .email-code {
          font-size: 35px !important;
          letter-spacing: 9px !important;
        }
      }

      @media only screen and (min-width: 1536px) {
        .email-shell {
          padding: 56px !important;
        }

        .email-card {
          max-width: 640px !important;
        }

        .email-header,
        .email-body {
          padding: 36px !important;
        }

        .email-title {
          font-size: 32px !important;
        }

        .email-copy {
          font-size: 17px !important;
        }

        .email-code {
          font-size: 36px !important;
          letter-spacing: 10px !important;
        }

        .email-warning {
          font-size: 15px !important;
        }
      }
    </style>
    <div class="email-shell" style="margin:0;padding:16px;background:#f4f7f6;font-family:Arial,sans-serif;color:#3f1f1f;">
      <div class="email-card" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #f1d7d7;">
        <div class="email-header" style="background:#b91c1c;padding:22px 20px;color:#ffffff;">
          <div style="font-size:13px;letter-spacing:1.2px;text-transform:uppercase;opacity:.85;">YVITY</div>
          <h1 class="email-title" style="margin:12px 0 0;font-size:21px;line-height:1.2;">${heading}</h1>
        </div>
        <div class="email-body" style="padding:20px;">
          <p class="email-copy" style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5b4a4a;">
            Use the code below to confirm your request to ${actionLabel}.
          </p>
          <div class="email-code-box" style="margin:24px 0;padding:16px 8px;border-radius:16px;background:#fffafa;border:1px solid #fecaca;text-align:center;overflow:hidden;">
            <div class="email-code-label" style="font-size:10px;color:#8f6f6f;letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px;">Verification code</div>
            <div class="email-code" style="font-size:24px;font-weight:700;letter-spacing:4px;color:#991b1b;white-space:nowrap;">${otp}</div>
          </div>
          <div style="margin:20px 0 0;padding:16px 18px;border-left:4px solid #dc2626;background:#fef2f2;border-radius:12px;">
            <p class="email-warning" style="margin:0;font-size:12px;line-height:1.6;color:#7f1d1d;">
              This code expires in 5 minutes. For your security, do not share it with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  `.trim();
}

async function getAdvisorUser() {
  const user = await ValidateAdvisor();

  if (!user?.id) {
    return { error: json("Unauthorized", 401) };
  }

  if (!user.email) {
    return { error: json("Add an email before using this account action.", 400) };
  }

  return { user };
}

export async function POST(req) {
  try {
    const { action } = await req.json();
    const config = ACTIONS[action];

    if (!config) {
      return json("Invalid account action", 400);
    }

    const { user, error } = await getAdvisorUser();
    if (error) return error;

    const supabase = createAdminClient();
    const { data: otp, error: otpError } = await supabase.rpc("create_otp", {
      p_identifier: user.email,
      p_purpose: config.purpose,
    });

    if (otpError || !otp) {
      return json(otpError?.message || "Unable to create OTP", 500);
    }

    await getTransporter().sendMail({
      from: `"Yvity" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: config.subject,
      text: `Your OTP to ${config.label} is ${otp}. It expires in 5 minutes.`,
      html: renderOtpEmail({ otp, actionLabel: config.label, heading: config.heading }),
    });

    return json("OTP sent to your registered email", 200, { email: user.email });
  } catch (error) {
    console.error("POST /api/advisor/account/danger-zone error:", error);
    return json(error.message || "Unable to send OTP", 500);
  }
}

export async function PATCH(req) {
  try {
    const { action, otp } = await req.json();
    const config = ACTIONS[action];

    if (!config) {
      return json("Invalid account action", 400);
    }

    if (!/^\d{6}$/.test(String(otp || ""))) {
      return json("Enter a valid 6-digit OTP", 400);
    }

    const { user, error } = await getAdvisorUser();
    if (error) return error;

    const supabase = createAdminClient();
    const { data: isVerified, error: verifyError } = await supabase.rpc("verify_otp", {
      p_identifier: user.email,
      p_otp: otp,
      p_purpose: config.purpose,
    });

    if (verifyError || !isVerified) {
      return json("Invalid or expired OTP", 400);
    }

    const now = new Date();
    const update =
      action === "deactivate"
        ? {
            account_status: "deactivated",
            is_active: false,
            deactivated_until: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            deleted_at: null,
            account_status_updated_at: now.toISOString(),
            account_status_reason: "advisor_requested_deactivation",
            original_mobile: user.original_mobile || user.mobile,
            original_email: user.original_email || user.email,
          }
        : {
            account_status: "deleted",
            is_active: false,
            deactivated_until: null,
            deleted_at: now.toISOString(),
            account_status_updated_at: now.toISOString(),
            account_status_reason: "advisor_requested_deletion",
            original_mobile: user.original_mobile || user.mobile,
            original_email: user.original_email || user.email,
          };

    const { error: updateError } = await supabase
      .from("users")
      .update(update)
      .eq("id", user.id);

    if (updateError) {
      return json(updateError.message || "Unable to update account", 500);
    }

    await supabase
      .from("advisor_profiles")
      .update({ ispublic_profile: false, updated_at: now.toISOString() })
      .eq("advisor_id", user.id);

    return clearAuthCookies(json(
      action === "deactivate"
        ? "Account deactivated for 30 days"
        : "Account deleted Successfully",
      200,
      {
        status: update.account_status,
        deactivated_until: update.deactivated_until || null,
        redirect_url: getFallbackRedirectUrl(),
      },
    ));
  } catch (error) {
    console.error("PATCH /api/advisor/account/danger-zone error:", error);
    return json(error.message || "Unable to update account", 500);
  }
}
