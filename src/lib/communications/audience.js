const PLAN_BY_AUDIENCE = {
  plan_gold: "gold",
  plan_silver: "silver",
  plan_free: "free",
};

function applyChannelConsent(query, { communicationType, channel }) {
  if (communicationType === "marketing") {
    query = query.eq("marketing_consent", true);

    if (channel === "whatsapp") {
      query = query.eq("marketing_whatsapp", true);
    }

    if (channel === "email") {
      query = query.eq("marketing_email", true);
    }
  } else if (channel === "whatsapp") {
    query = query.eq("transactional_whatsapp", true);
  } else if (channel === "email") {
    query = query.eq("transactional_email", true);
  }

  return query;
}

function applyContactFilter(query, channel) {
  if (channel === "whatsapp") {
    return query.not("mobile", "is", null).neq("mobile", "");
  }

  if (channel === "email") {
    return query.not("email", "is", null).neq("email", "");
  }

  return query;
}

/**
 * Resolves recipient rows for a communication (id + mobile/email only — never returned to client in bulk).
 */
export async function resolveAudienceRecipients(
  supabase,
  { audience, communicationType, channel = "whatsapp" },
) {
  const plan = PLAN_BY_AUDIENCE[audience];
  const needsAdvisorJoin = audience === "advisors" || Boolean(plan);

  let query;

  if (audience === "customers") {
    const { data: advisorRows } = await supabase
      .from("advisor_profiles")
      .select("user_id");

    const advisorIdSet = new Set(
      (advisorRows || []).map((row) => row.user_id).filter(Boolean),
    );

    query = supabase.from("users").select("id, mobile, email, name");
    query = applyChannelConsent(query, { communicationType, channel });
    query = applyContactFilter(query, channel);

    const { data, error } = await query.limit(5000);

    if (error) {
      throw error;
    }

    return (data || []).filter((user) => !advisorIdSet.has(user.id));
  }

  if (needsAdvisorJoin) {
    query = supabase
      .from("users")
      .select("id, mobile, email, name, advisor_profiles!inner(subscription_plan)");
  } else {
    query = supabase.from("users").select("id, mobile, email, name");
  }

  query = applyChannelConsent(query, { communicationType, channel });
  query = applyContactFilter(query, channel);

  if (plan) {
    query = query.eq("advisor_profiles.subscription_plan", plan);
  }

  const { data, error } = await query.limit(5000);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function countAudienceRecipients(supabase, options) {
  const recipients = await resolveAudienceRecipients(supabase, options);
  return recipients.length;
}
