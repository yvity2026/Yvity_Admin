export async function recordAdvisorLoginActivity(supabase, user) {
  if (!supabase || !user?.id || !user.roles?.includes("advisor")) {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("advisor_login_activity").insert({
    advisor_id: user.id,
    login_date: today,
  });

  const isDuplicateLogin = error?.code === "23505";

  if (error && !isDuplicateLogin) {
    console.error("Failed to record advisor login activity:", error);
    return;
  }

  const { error: scoreError } = await supabase.rpc(
    "increment_advisor_login_score",
    {
      p_advisor: user.id,
      p_login_date: today,
    }
  );

  if (scoreError) {
    console.error("Failed to update advisor login score:", {
      code: scoreError.code ?? null,
      message: scoreError.message ?? "Unknown Supabase RPC error",
      details: scoreError.details ?? null,
      hint: scoreError.hint ?? null,
    });
  }

  const { error: userError } = await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  if (userError) {
    console.error("Failed to update advisor last_login_at:", userError);
  }
}
