import { apiResponse } from "@/lib/apiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto"
import { sendResponse } from "next/dist/server/image-optimizer";

export async function POST(req) {
  try {
    const { profileId } = await req.json();
    const user = await getUser()
    let viewerId;
    const supabase = createAdminClient()
    if(user?.token){
      const { user : viewer, error} = await supabase
      .from('users')
      .select("id")
      .filter("device_tokens", "cs", JSON.stringify([{ token: user.token }]))
      .maybeSingle();
      if(viewer){
        viewerId = viewer.id
      }
    } 
    const ip =req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    //Hash the ip address : 
  const anonymousId = crypto.createHash("sha256").update(ip + userAgent).digest("hex");
  const { data : existing} = await supabase
  .from("advisor_profile_stats")
  .select("profile_id")
  .eq("profile_id", profileId)
  .eq("stats_type", "view")
  .or(
      user
        ? `viewer_id.eq.${viewerId}`
        : `anonymous_id.eq.${anonymousId}`
    )
    
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .maybeSingle()
    if(existing){
      return apiResponse()
    }

    await supabase.from("profile_views").insert({
    profile_id: profileId,
    viewer_id: viewerId || null,
    anonymous_id: viewerId ? null : anonymousId,
    stats_type : "view"
  })
  return apiResponse()
  } catch (error) {
    return sendResponse()
  }
}
