import fs from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/server";

function writeJson(dir, filename, data) {
  fs.writeFileSync(path.join(dir, filename), `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

function mapUserRow(row) {
  return {
    id: row.id,
    fullName: row.name || "",
    phone: row.mobile || "",
    email: row.email || "",
    dob: row.dob || "",
    gender: row.gender || "",
    city: row.city || "",
    state: row.state || "",
    profession: row.profession || "",
    selfieUrl: row.selfie_url || null,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    account_status: row.account_status || "active",
  };
}

function mapProfileRow(row) {
  return {
    id: row.id,
    advisor_id: row.advisor_id,
    user_id: row.advisor_id,
    account_status: row.account_status || "under_review",
    profile_status: Boolean(row.profile_status),
    profile_slug: row.profile_slug || "",
    subscription_plan: row.subscription_plan || "free",
    iridai_certificate_url: row.iridai_certificate_url || null,
    irdai_rejected_reason: row.irdai_rejected_reason || null,
    advisor_role_id: row.advisor_role_id || null,
    designation: row.designation || null,
    bio: row.short_bio || null,
    submitted_at: row.created_at || null,
    approved_at: row.subscription_activated_at || null,
    subscription_started_at: row.subscription_activated_at || null,
    subscription_expires_at: row.subscription_expires_at || null,
  };
}

function mapPaymentRow(row) {
  const amountInr = Number(row.amount) || 0;
  return {
    id: row.id,
    user_id: row.user_id,
    plan_id: row.plan_id || "silver",
    amount_inr: amountInr,
    amount_paise: Math.round(amountInr * 100),
    razorpay_order_id: row.razorpay_order_id || "",
    razorpay_payment_id: row.razorpay_payment_id || null,
    status: row.status === "paid" ? "paid" : row.status === "failed" ? "failed" : "created",
    created_at: row.created_at || new Date().toISOString(),
    paid_at: row.paid_at || null,
  };
}

/** Mirror core Supabase tables into runtime JSON for analytics + local stores. */
export async function hydrateCoreTablesToRuntimeData(dir) {
  const supabase = createAdminClient();

  const [usersRes, profilesRes, paymentsRes, servicesRes, advisorReviewsRes, platformReviewsRes] =
    await Promise.all([
      supabase.from("users").select("*"),
      supabase.from("advisor_profiles").select("*"),
      supabase.from("advisor_payments").select("*"),
      supabase.from("advisor_services").select("*"),
      supabase.from("advisor_testimonials").select("*"),
      supabase.from("yvity_testimonials").select("*"),
    ]);

  const users = usersRes.data || [];
  const profiles = profilesRes.data || [];
  const payments = paymentsRes.data || [];
  const services = servicesRes.data || [];

  writeJson(dir, "registration.json", {
    users: users.map(mapUserRow),
    selfieUrls: {},
  });

  const profilesMap = {};
  for (const profile of profiles) {
    profilesMap[profile.advisor_id] = mapProfileRow(profile);
  }
  writeJson(dir, "advisor-profiles.json", { profiles: profilesMap });

  const paymentsMap = {};
  for (const payment of payments) {
    paymentsMap[payment.id] = mapPaymentRow(payment);
  }
  writeJson(dir, "advisor-payments.json", { payments: paymentsMap });

  const servicesByAdvisor = {};
  for (const service of services) {
    const advisorId = service.advisor_id;
    if (!advisorId) continue;
    if (!servicesByAdvisor[advisorId]) servicesByAdvisor[advisorId] = [];
    servicesByAdvisor[advisorId].push({
      service_type: service.service_type,
      company: service.company,
      experience_years: service.experience_years,
      key_services: service.key_services || [],
    });
  }
  for (const [advisorId, rows] of Object.entries(servicesByAdvisor)) {
    writeJson(dir, `services-${advisorId}.json`, rows);
  }

  const reviewsByAdvisor = {};
  for (const review of advisorReviewsRes.data || []) {
    const advisorId = review.advisor_id;
    if (!advisorId) continue;
    if (!reviewsByAdvisor[advisorId]) reviewsByAdvisor[advisorId] = [];
    reviewsByAdvisor[advisorId].push({
      id: review.id,
      type: review.testimonial_type || "text",
      quote: review.content || "",
      rating: Number(review.testimonial_rating) || 0,
      status: review.status || "published",
      submittedAt: review.created_at,
      mobile: review.mobile_number,
      verified: review.is_mobile_verified,
      advisorReply: review.reply_text
        ? { text: review.reply_text, repliedOn: review.reply_created_at }
        : null,
    });
  }
  for (const [advisorId, rows] of Object.entries(reviewsByAdvisor)) {
    writeJson(dir, `testimonials-${advisorId}.json`, rows);
  }

  writeJson(dir, "yvity-testimonials.json", {
    testimonials: (platformReviewsRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      profession: row.profession,
      city: row.city,
      respondent_type: row.respondent_type,
      mobile_number: row.mobile_number,
      testimonial_type: row.testimonial_type,
      testimonial_rating: row.testimonial_rating,
      content: row.content,
      status: row.status,
      created_at: row.created_at,
      yvity_reply: row.yvity_reply || "",
    })),
  });

  writeJson(dir, "user-admin-state.json", { users: {} });
  writeJson(dir, "advisor-review-admin-state.json", { reviews: {} });
}
