export async function recordAdvisorLoginActivity(supabase, user) {
  if (!supabase || !user?.id || !user.roles?.includes("advisor")) {
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("advisor_login_activity")
    .upsert(
      {
        advisor_id: user.id,
        login_date: today,
      },
      {
        onConflict: "advisor_id,login_date",
        ignoreDuplicates: true,
      }
    );

  if (error) {
    console.error("Failed to record advisor login activity:", error);
    return;
  }

  const { error: userError } = await supabase
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  if (userError) {
    console.error("Failed to update advisor last_login_at:", userError);
  }
}
